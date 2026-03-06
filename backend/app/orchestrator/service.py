import hashlib
import json
import logging
from datetime import datetime

from sqlalchemy.orm import Session

from app.agents.agents import (
    CommerceAgent,
    CreativeDirectorAgent,
    DistributionAgent,
    EbookAgent,
    OfferAgent,
    OpportunityAgent,
    PDEAgent,
    ProductArchitectAgent,
    SignalsAgent,
)
from app.models.entities import Asset, ContentCalendar, Listing, Opportunity, Run, RunStatus, Signal, StrategyDoc
from app.services.storage import LocalStorage

logger = logging.getLogger(__name__)


class Orchestrator:
    def __init__(self, db: Session):
        self.db = db
        self.storage = LocalStorage()

    def _idem(self, project_id: int, run_type: str, strategy_version: int, opportunity_ids: list[int]) -> str:
        payload = f"{project_id}|{run_type}|{strategy_version}|{','.join(map(str, sorted(opportunity_ids)))}"
        return hashlib.sha256(payload.encode()).hexdigest()

    def start_run(self, project_id: int, run_type: str, strategy_version: int = 0, opportunity_ids: list[int] | None = None) -> Run:
        opportunity_ids = opportunity_ids or []
        key = self._idem(project_id, run_type, strategy_version, opportunity_ids)
        existing = self.db.query(Run).filter(Run.idempotency_key == key).first()
        if existing:
            return existing
        run = Run(project_id=project_id, run_type=run_type, status=RunStatus.queued, idempotency_key=key)
        self.db.add(run)
        self.db.commit()
        self.db.refresh(run)
        return run

    def execute(self, run: Run, topic: str = "startup"):
        run.status = RunStatus.running
        run.started_at = datetime.utcnow()
        self.db.commit()
        try:
            if run.run_type in ["signals", "build_all"]:
                sig = SignalsAgent().execute({"topic": topic})
                self.db.add(Signal(project_id=run.project_id, source_type=sig.source, query=topic, payload_json=sig.model_dump()))
            if run.run_type in ["opportunities", "build_all"]:
                opp = OpportunityAgent().execute({"topic": topic})
                self.db.add(Opportunity(project_id=run.project_id, title=opp.title, confidence_score=opp.confidence_score, demand_score=opp.demand_score, competition_score=opp.competition_score, profit_score=opp.profit_score, differentiation_json=opp.model_dump()))
            if run.run_type in ["strategy", "build_all"]:
                strat = OfferAgent().execute({"topic": topic}).model_dump()
                strat["proof_pack"] = PDEAgent().execute({"topic": topic}).model_dump()
                strat["product_blueprint"] = ProductArchitectAgent().execute({"topic": topic}).model_dump()
                latest = self.db.query(StrategyDoc).filter(StrategyDoc.project_id == run.project_id).order_by(StrategyDoc.version.desc()).first()
                version = 1 if not latest else latest.version + 1
                self.db.add(StrategyDoc(project_id=run.project_id, version=version, strategy_json=strat))
            if run.run_type in ["assets", "build_all"]:
                outline = EbookAgent().execute({"topic": topic}).model_dump_json(indent=2)
                path = self.storage.write_text(run.project_id, "ebook_outline", "json", outline)
                self.db.add(Asset(project_id=run.project_id, asset_type="ebook_outline", format="json", storage_url=path, meta_json={"kind": "outline"}))
                pins = CreativeDirectorAgent().execute({"topic": topic}).model_dump_json(indent=2)
                ppath = self.storage.write_text(run.project_id, "pin_briefs", "json", pins)
                self.db.add(Asset(project_id=run.project_id, asset_type="pin_briefs", format="json", storage_url=ppath, meta_json={"kind": "briefs"}))
            if run.run_type in ["commerce", "build_all"]:
                for platform in ["gumroad", "etsy"]:
                    listing = CommerceAgent().execute({"topic": topic, "platform": platform})
                    self.db.add(Listing(project_id=run.project_id, platform=platform, listing_json=listing.model_dump()))
            if run.run_type in ["distribution", "build_all"]:
                for platform in ["instagram", "threads", "pinterest"]:
                    cal = DistributionAgent().execute({"topic": topic, "platform": platform})
                    self.db.add(ContentCalendar(project_id=run.project_id, platform=platform, month=cal.month, calendar_json=cal.model_dump()))
            if run.run_type in ["build_all"]:
                opl = {"optimization_plan": "Collect conversion by platform weekly and feed metrics into signals payload_json hook."}
                p = self.storage.write_text(run.project_id, "growth_loop", "json", json.dumps(opl))
                self.db.add(Asset(project_id=run.project_id, asset_type="growth_loop", format="json", storage_url=p, meta_json=opl))

            run.status = RunStatus.succeeded
            run.finished_at = datetime.utcnow()
            run.tokens_used = 0
            run.cost_estimate = 0
            self.db.commit()
        except Exception as exc:
            logger.exception("run failed", extra={"run_id": run.id, "run_type": run.run_type})
            run.status = RunStatus.failed
            run.finished_at = datetime.utcnow()
            run.error_json = {"message": str(exc), "schema": "unknown"}
            self.db.commit()
            raise
