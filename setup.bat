@echo off
echo 🚀 Setting up From Chaos to Clean Architecture Challenge...

REM Backend Express
echo 📦 Installing Express.js backend dependencies...
cd backend-express
call npm install
cd ..

REM Python Service
echo 🐍 Setting up Python microservice...
cd service-python
pip install -r requirements.txt
cd ..

REM React Frontend
echo ⚛️ Installing React frontend dependencies...
cd frontend-react
call npm install
cd ..

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Open each service folder in your IDE
echo 2. Start services in separate terminals:
echo    - Backend: cd backend-express ^&^& npm start
echo    - Python: cd service-python ^&^& python app.py
echo    - Frontend: cd frontend-react ^&^& npm run dev
echo 3. Begin your Copilot collaboration journey!