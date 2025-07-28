import express from 'express';
import axios from 'axios';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();
app.use(express.json());

// Predict endpoint
app.post('/predict', async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { message } = req.body;

    // For Vercel deployment, you'll need to replace this with your Python API URL
    // You can deploy the Python API separately or use a service like Railway, Render, etc.
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:5001';
    
    const response = await axios.post(`${pythonApiUrl}/predict`, {
      message,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error contacting Flask:", error.message);
    res.status(500).json({ error: "Model service unavailable" });
  }
});

// Clipboard endpoint
app.post('/clipboard', async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { clipboard } = req.body;
    if (!clipboard || typeof clipboard !== "string" || clipboard.length < 2) {
      return res.status(400).json({ error: "No clipboard text provided" });
    }

    // For Vercel deployment, you'll need to replace this with your Python API URL
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:5001';
    
    // Forward to Flask /predict
    const response = await axios.post(`${pythonApiUrl}/predict`, {
      message: clipboard,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error in /api/clipboard:", error.message);
    res.status(500).json({ error: "Clipboard model service unavailable" });
  }
});

// Export the Express app as a Vercel serverless function
export default app; 