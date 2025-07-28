# PaySafe Security

A comprehensive security application that monitors clipboard content for potential threats using machine learning.

## Features

- 🔒 **Clipboard Monitoring**: Real-time clipboard content analysis
- 🤖 **ML-Powered Detection**: Uses trained models to identify security threats
- 📱 **Android App**: Native Android application for clipboard monitoring
- 🌐 **Web Dashboard**: React-based web interface
- 🔄 **Real-time Sync**: WebSocket-based real-time updates

## Project Structure

```
PaySafeSecurity/
├── client/                 # React frontend
├── server/                 # Express.js backend
├── python-api/             # Python ML API (separate service)
├── clipboard-monitor/      # Android application
├── model/                  # ML models and data
└── venv/                   # Python virtual environment
```

## 🚀 Railway Deployment (Recommended)

Railway is the best option for deploying this full-stack application. We'll deploy **two separate services**:

1. **Node.js Backend** (main service)
2. **Python API** (ML service)

### Step 1: Deploy Node.js Backend

1. **Go to [railway.app](https://railway.app)** and sign up with your GitHub account
2. **Create a new project** and select "Deploy from GitHub repo"
3. **Connect your repository**: `https://github.com/wgmrcllanaa/PaySafe.git`
4. **Railway will automatically detect** the configuration and deploy the Node.js service

### Step 2: Deploy Python API

1. **In the same Railway project**, click "New Service"
2. **Select "GitHub Repo"** and choose the same repository
3. **Set the source directory** to `python-api`
4. **Railway will deploy** the Python API as a separate service

### Step 3: Configure Environment Variables

After both services are deployed, go to your Railway project dashboard:

#### For the Node.js service:
```
NODE_ENV=production
PYTHON_API_URL=https://your-python-service-url.railway.app
```

#### For the Python service:
```
PORT=5001
```

### Step 4: Access Your Application

- **Main Application**: `https://your-nodejs-service.railway.app`
- **Python API**: `https://your-python-service.railway.app`

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- Python 3.8+
- npm or yarn

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/wgmrcllanaa/PaySafe.git
   cd PaySafe
   ```

2. **Install dependencies**:
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Start the development servers**:
   ```bash
   # Terminal 1: Start Python API
   python api.py
   
   # Terminal 2: Start Node.js backend
   npm run dev
   
   # Terminal 3: Start React frontend
   npm run dev:client
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
   - Python API: http://localhost:5001

## 📱 Android App

The Android application is located in the `clipboard-monitor/` directory. To build and run:

1. Open the project in Android Studio
2. Build and run on your device or emulator
3. The app will automatically connect to your deployed backend

## 🔧 Configuration

### Environment Variables

- `NODE_ENV`: Set to `production` for deployment
- `PYTHON_API_URL`: URL of your Python API service
- `PORT`: Port for the Python API (Railway sets this automatically)

### Model Files

Ensure these files are present in the `model/` directory:
- `calibrated_svm_model.joblib`
- `tokenizer.pkl`
- `lstm_feature_extractor.h5`
- `optimal_threshold.txt`

## 🚀 Alternative Deployment Options

### Vercel (Frontend Only)

If you prefer Vercel for the frontend:

1. Deploy the Python API to Railway first
2. Set the `PYTHON_API_URL` environment variable in Vercel
3. Deploy the frontend to Vercel

### Render

You can also deploy to Render.com:
1. Create a new Web Service
2. Connect your GitHub repository
3. Set the build command and start command
4. Configure environment variables

## 📊 API Endpoints

### Python API (`/predict`)
- **POST**: Analyze text for security threats
- **Body**: `{"message": "text to analyze"}`
- **Response**: `{"label": "SAFE|UNSAFE|UNSURE", "confidence": 0.85}`

### Node.js Backend
- **POST** `/api/predict`: Proxy to Python API
- **POST** `/api/clipboard`: Handle clipboard data from Android
- **WebSocket** `/ws_clipboard`: Real-time clipboard sync

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the Railway logs for errors
2. Verify environment variables are set correctly
3. Ensure all model files are present
4. Check that both services are running and accessible 