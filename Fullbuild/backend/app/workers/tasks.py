from app.db.session import SessionLocal
from app.models.entities import Project, Run
from app.orchestrator.service import Orchestrator
from app.workers.celery_app import celery_app


@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def run_workflow_task(self, run_id: int):
    db = SessionLocal()
    try:
        orchestrator = Orchestrator(db)
        run = db.get(Run, run_id)
        project = db.get(Project, run.project_id)
        orchestrator.execute(run, topic=project.niche or "startup")
    finally:
        db.close()
