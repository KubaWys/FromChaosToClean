# Deployment & Scaling Runbook

## Local Docker Compose (Recommended for Dev)
1. Build all images:
   - `docker build -t fromchaos-express ./backend-express`
   - `docker build -t fromchaos-flask ./service-python`
   - `docker build -t fromchaos-react ./frontend-react`
2. Run containers:
   - `docker run -p 3001:3001 fromchaos-express`
   - `docker run -p 5000:5000 fromchaos-flask`
   - `docker run -p 3000:3000 fromchaos-react`

## Kubernetes (Production/Scaling)
1. Apply manifests:
   - `kubectl apply -f k8s-deployment.yaml`
2. Scale up/down:
   - `kubectl scale deployment/fromchaos-express --replicas=3`
   - `kubectl scale deployment/fromchaos-flask --replicas=3`
   - `kubectl scale deployment/fromchaos-react --replicas=3`
3. Monitor pods:
   - `kubectl get pods`

## Monitoring
- Prometheus can scrape `/metrics` endpoints on all services for basic request counts.
- Logs are written to `server.log` (Express) and `flask.log` (Flask).

## Notes
- All secrets should be provided via environment variables.
- For production, use persistent storage for SQLite or migrate to a managed DB.
