// index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./globals.css";
import App from "./App";
import Chatbot from "./pages/YouTubeLearningChatbot";
import Learning from "./pages/Learning";
import MLLearningPath from "./pages/MLLearningPath";
import GuitarLearningPath from "./pages/GuitarLearningPath";
import { Toaster } from "./components/ui/toaster";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Toaster />
    <Router>
      <Routes>
        {/* Define routes for the entire app */}
        <Route path="/" element={<App />} /> {/* Main page route */}
        <Route path="/YouTubeLearningChatbot" element={<Chatbot />} /> 
        <Route path="/learning-paths/machinelearning" element={<MLLearningPath />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning-paths/guitar" element={<GuitarLearningPath />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
