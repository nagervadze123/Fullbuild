from app.db.session import SessionLocal
from app.models.entities import Project, RunStatus, User
from app.orchestrator.service import Orchestrator
from app.services.auth import hash_password


def test_orchestrator_transitions_and_idempotency():
    db = SessionLocal()
    user = User(email='o@test.com', password_hash=hash_password('pw'))
    db.add(user)
    db.commit(); db.refresh(user)
    project = Project(user_id=user.id, name='p', niche='ai', target_market='founders', platform_targets=['gumroad'])
    db.add(project); db.commit(); db.refresh(project)

    orch = Orchestrator(db)
    run1 = orch.start_run(project.id, 'signals', 0, [])
    run2 = orch.start_run(project.id, 'signals', 0, [])
    assert run1.id == run2.id
    orch.execute(run1, topic='ai')
    assert run1.status == RunStatus.succeeded
    db.close()
