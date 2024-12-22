import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ChatIcon = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  z-index: 1000;

  &:hover {
    background-color: #45a049;
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px;
  z-index: 1000;
`;

const ChatInput = styled.input`
  width: calc(100% - 50px);
  padding: 10px;
  border: 1px solid #ddd;
`;

const ChatButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const ChatBox = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return; // Prevent empty input
    setIsLoading(true);

    fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: chatInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          { query: chatInput, response: data.choices[0]?.text || "No response received." },
        ]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Chatbot error:", err);
        setMessages((prev) => [
          ...prev,
          { query: chatInput, response: "Error: Unable to fetch response" },
        ]);
        setIsLoading(false);
      });

    setChatInput("");
  };

  useEffect(() => {
    const chatBox = document.querySelector("#chatBox");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  return (
    <>
      <ChatIcon onClick={() => setIsOpen(!isOpen)}>💬</ChatIcon>
      {isOpen && (
        <ChatContainer>
          <ChatBox id="chatBox">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>You:</strong> {msg.query}
                <br />
                <strong>Bot:</strong> {msg.response}
                <hr />
              </div>
            ))}
            {isLoading && <div>Loading...</div>}
          </ChatBox>
          <div style={{ display: "flex" }}>
            <ChatInput
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask something..."
            />
            <ChatButton onClick={handleChatSubmit}>▶</ChatButton>
          </div>
        </ChatContainer>
      )}
    </>
  );
}

export default Chatbot;
