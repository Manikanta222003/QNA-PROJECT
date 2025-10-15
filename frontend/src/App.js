import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Add your styles and animations here

function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set your live Render backend URL here
  const BACKEND_URL = "https://qna-project.onrender.com";

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userQuestion = question;
    setChatHistory([...chatHistory, { type: "user", text: userQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      // Make POST request to your live backend
      const response = await axios.post(`${BACKEND_URL}/chat`, {
        question: userQuestion,
      });

      const botAnswer = response.data.answer || "Sorry, I don't know the answer.";

      // Small delay to simulate typing animation
      setTimeout(() => {
        setChatHistory((prev) => [...prev, { type: "bot", text: botAnswer }]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", text: "Something went wrong. Please try again." },
      ]);
      setLoading(false);
      console.error("Error calling backend:", error);
    }
  };

  return (
    <div className="chat-app">
      <h1>Q&A Chatbot</h1>

      <div className="chat-container">
        {chatHistory.map((chat, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${chat.type === "user" ? "user" : "bot"}`}
          >
            {chat.text}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble bot typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          onKeyPress={(e) => e.key === "Enter" && handleAsk()}
        />
        <button onClick={handleAsk}>Ask</button>
      </div>
    </div>
  );
}

export default App;
