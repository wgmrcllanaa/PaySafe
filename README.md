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
├── api/                    # Vercel serverless functions
├── clipboard-monitor/      # Android application
├── model/                  # ML models and data
└── venv/                   # Python virtual environment
```

## Deployment to Vercel

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install with `npm i -g vercel`
3. **Python API**: Deploy your Python Flask API separately (see below)

### Step 1: Deploy Python API

Since Vercel doesn't support Python directly, you'll need to deploy your Python API separately. Recommended options:

- **Railway**: [railway.app](https://railway.app)
- **Render**: [render.com](https://render.com)
- **Heroku**: [heroku.com](https://heroku.com)

#### Railway Deployment (Recommended)

1. Create a `requirements.txt` file in your project root:
```txt
flask==2.3.3
flask-cors==4.0.0
numpy==1.24.3
scikit-learn==1.3.0
tensorflow==2.13.0
joblib==1.3.2
```

2. Create a `Procfile`:
```
web: python api.py
```

3. Deploy to Railway and get your API URL

### Step 2: Deploy to Vercel

1. **Install Dependencies**:
```bash
npm install
```

2. **Set Environment Variables**:
Create a `.env.local` file:
```env
PYTHON_API_URL=https://your-python-api.railway.app
```

3. **Deploy**:
```bash
vercel
```

4. **Configure Environment Variables in Vercel Dashboard**:
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add `PYTHON_API_URL` with your Python API URL

### Step 3: Update API Configuration

Update the `api/index.ts` file with your Python API URL:

```typescript
const pythonApiUrl = process.env.PYTHON_API_URL || 'https://your-python-api.railway.app';
```

## Local Development

### Frontend
```bash
npm run dev:client
```

### Backend
```bash
npm run dev
```

### Python API
```bash
cd venv
source bin/activate  # On Windows: venv\Scripts\activate
python api.py
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PYTHON_API_URL` | URL of your deployed Python API | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## API Endpoints

- `POST /api/predict` - Predict security threat from text
- `POST /api/clipboard` - Process clipboard content
- `GET /ws_clipboard` - WebSocket endpoint for real-time updates

## Troubleshooting

### Common Issues

1. **Python API Connection Error**:
   - Ensure your Python API is deployed and accessible
   - Check the `PYTHON_API_URL` environment variable
   - Verify CORS settings in your Python API

2. **Build Errors**:
   - Clear Vercel cache: `vercel --force`
   - Check TypeScript errors: `npm run check`

3. **WebSocket Issues**:
   - WebSocket support in Vercel is limited
   - Consider using a separate WebSocket service like Socket.io

### Support

For issues and questions:
- Check the [Vercel documentation](https://vercel.com/docs)
- Review the [Railway documentation](https://docs.railway.app)
- Open an issue in this repository

## License

MIT License - see LICENSE file for details. 