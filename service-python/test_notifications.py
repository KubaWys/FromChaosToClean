import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health(client):
    resp = client.get('/utils/health')
    assert resp.status_code == 200
    assert resp.json['status'] == 'ok'

def test_create_notification(client):
    resp = client.post('/notifications', json={
        'user_id': 'testuser',
        'message': 'Hello!'
    })
    assert resp.status_code == 201
    assert 'id' in resp.json
