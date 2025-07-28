import React, { useState } from "react";
import axios from "axios";

export default function PredictForm() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5002/api/predict", { message });
      setResult(response.data.result);
    } catch (error) {
      console.error("Prediction failed", error);
      setResult("Error: Could not get prediction");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">SMS Scam Detector</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Enter SMS message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Predict
        </button>
      </form>
      {result && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}
