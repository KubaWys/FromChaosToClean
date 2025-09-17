import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_track_event(client):
    resp = client.post('/analytics/track', json={
        'event_type': 'login',
        'user_id': 'testuser',
        'data': {'foo': 'bar'}
    })
    assert resp.status_code == 201
    assert resp.json['success'] is True
