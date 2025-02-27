import React, { useRef, useState } from "react";
import { predict } from "./api";

export default function DigitRecognizer() {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [modelVersion, setModelVersion] = useState(1); // default to "base"
  const [confidence, setConfidence] = useState(0);
  const [latency, setLatency] = useState(0);
  const [message, setMessage] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const startDrawing = (event) => {
    setIsDrawing(true);
    const coords = getCoordinates(event, canvasRef.current);
    lastPos.current = coords;
    setPrediction(null);
    setConfidence(0);
    setMessage("");
  };

  const draw = (event) => {
    if (!isDrawing) return;
    event.preventDefault();

    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    const coords = getCoordinates(event, canvasRef.current);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPos.current = coords;
  };

  const stopDrawing = () => setIsDrawing(false);

  const getCoordinates = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.touches ? event.touches[0].clientX : event.clientX) - rect.left,
      y: (event.touches ? event.touches[0].clientY : event.clientY) - rect.top,
    };
  };

  const getCanvasData = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext("2d");

    // Disable anti-aliasing
    tempCtx.imageSmoothingEnabled = false;

    // Draw the original canvas content onto the 28x28 canvas
    tempCtx.drawImage(canvas, 0, 0, 28, 28);

    // Get the pixel data
    const imageData = tempCtx.getImageData(0, 0, 28, 28).data;

    // Check if the canvas is empty
    let hasContent = false;
    for (let i = 0; i < imageData.length; i += 4) {
      if (imageData[i + 3] > 10) {
        // Check alpha channel for content
        hasContent = true;
        break;
      }
    }

    if (!hasContent) {
      return null; // Return null if the canvas is empty
    }

    // Convert RGBA to grayscale and normalize
    let pixels = [];
    for (let i = 0; i < imageData.length; i += 4) {
      pixels.push(imageData[i + 3] / 255); // Use alpha channel for grayscale
    }

    return pixels;
  };

  const handlePredict = async () => {
    const pixels = getCanvasData();
    if (!pixels) {
      setMessage("Please draw a digit");
      return;
    }
  
    // Start measuring latency
    const startTime = performance.now();
  
    const result = await predict(pixels, modelVersion); // Pass the selected model version to the API
  
    // End measuring latency
    const endTime = performance.now();
    const latency = endTime - startTime; // Latency in milliseconds
  
    if (result) {
      const predictions = result.predictions[0];
      const maxConfidence = Math.max(...predictions);
      const predictedDigit = predictions.indexOf(maxConfidence);
  
      if (maxConfidence < 0.5) {
        setMessage("Not confident enough. Please draw more clearly.");
      } else {
        setPrediction(predictedDigit);
        setConfidence(maxConfidence);
        setLatency(latency);
      }
    } else {
      setMessage("Error making prediction. Please try again.");
    }
  };

  const handleClear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setPrediction(null);
    setConfidence(0);
    setMessage("");
  };

  // Model version select handler
  const handleModelVersionChange = (event) => {
    setModelVersion(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
      >
        🧠 MNIST Digit Recognizer
      </h1>

      <p
        style={{
          maxWidth: "800px",
          marginBottom: "0.5rem",
          fontSize: "1rem",
          lineHeight: "1.5",
        }}
      >
        {" "}
        Welcome to the MNIST Digit Recognizer, a machine learning project
        developed by Tom Nelson Tembo for my bachelor thesis at the Czech
        University of Life Sciences in Prague. This app explores deep learning
        optimization for digit classification. It features three models:
      </p>
      <p
        style={{
          maxWidth: "800px",
          marginBottom: "0.5rem",
          marginTop: "0.5rem",
          fontSize: "1rem",
          lineHeight: "1.5",
        }}
      >
        <br /> - <strong>Base Model</strong>: A
        standard neural network trained on MNIST. <br /> -{" "}
        <strong>Pruned Model</strong>: A size-optimized version of the base
        model. <br /> - <strong>Quantized Model</strong>: A precision-reduced
        model for edge device efficiency.{" "}
      </p>
      <p
        style={{
          maxWidth: "800px",
          marginBottom: "0.5rem",
          fontSize: "1rem",
          lineHeight: "1.5",
        }}
      >
        {" "}
        The backend uses TensorFlow Serving for fast, scalable inference. Users
        can draw a digit, and the app classifies it in real-time, showcasing
        trade-offs between model size, accuracy, and performance.{" "}
      </p>
      <p
        style={{
          maxWidth: "800px",
          marginBottom: "0.5rem",
          fontSize: "1rem",
          lineHeight: "1.5",
        }}
      >
        {" "}
        Connect with me on{" "}
        <a
          href="https://www.linkedin.com/in/tom-nelson-tembo-440ba0235/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0077b5", textDecoration: "underline" }}
        >
          LinkedIn
        </a>{" "}
        or check out my projects on{" "}
        <a
          href="https://github.com/TomNelsonTembo"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0077b5", textDecoration: "underline" }}
        >
          GitHub
        </a>
        .{" "}
      </p>

      {/* Model version selection */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}>
          Select Model Version:{" "}
        </label>
        <select
          value={modelVersion}
          onChange={handleModelVersionChange}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#333",
            color: "white",
            borderRadius: "0.5rem",
            border: "1px solid #444",
          }}
        >
          <option value="1">Base Model</option>
          <option value="2">Pruned Model</option>
          <option value="3">Quantized Model </option>
        </select>
      </div>

      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        style={{
          border: "4px solid white",
          backgroundColor: "white",
          cursor: "crosshair",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
      ></canvas>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#10b981",
            color: "white",
            fontWeight: "600",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
          }}
          onClick={handlePredict}
        >
          🧠 Predict
        </button>
        <button
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#ef4444",
            color: "white",
            fontWeight: "600",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
          }}
          onClick={handleClear}
        >
          🔄 Clear
        </button>
      </div>

      {message && (
        <p style={{ marginTop: "1rem", fontSize: "1.125rem" }}>{message}</p>
      )}
      {prediction !== null && (
        <div
          style={{
            marginTop: "1rem",
            backgroundColor: "white",
            color: "black",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            Predicted Digit: {prediction}
          </p>
          <p style={{ fontSize: "1rem" }}>
            Confidence: {(confidence * 100).toFixed(1)}%
          </p>
          <p style={{ fontSize: "1rem" }}>
            Latency: {(latency).toFixed(2)} ms
          </p>
        </div>
      )}
    </div>
  );
}
