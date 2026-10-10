import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AIChatbot() {

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);


  // ==============================
  // SEND MESSAGE
  // ==============================

  const sendMessage = async (e) => {

    e.preventDefault();

    if (message.trim() === "") {
      return;
    }

    const userMessage = message.trim();


    // Add user message
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: "user",
        text: userMessage
      }
    ]);

    setMessage("");
    setLoading(true);


    try {

      const response = await axios.post(
        "http://localhost:8092/api/ai/chat",
        {
          message: userMessage
        }
      );


      // Add AI response
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "ai",
          text: response.data.response
        }
      ]);

    } catch (error) {

      console.error(
        "AI chatbot error:",
        error
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "ai",
          text:
            "Sorry, I couldn't process your request. Please make sure the backend is running."
        }
      ]);

    } finally {

      setLoading(false);

    }

  };


  // ==============================
  // QUICK QUESTION
  // ==============================

  const askQuestion = (question) => {

    setMessage(question);

  };


  return (

    <div className="ai-chatbot-page">


      {/* ==========================
          NAVBAR
      ========================== */}

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          🌱 Smart Village
        </div>


        <div className="dashboard-nav-buttons">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>


          <button
            onClick={() =>
              navigate("/services")
            }
          >
            Services
          </button>


          <button
            onClick={() =>
              navigate("/")
            }
          >
            Home
          </button>

        </div>

      </nav>


      {/* ==========================
          CHAT CONTAINER
      ========================== */}

      <div className="chatbot-container">


        {/* HEADER */}

        <div className="chatbot-header">

          <div className="chatbot-icon">
            🤖
          </div>


          <div>

            <h1>
              Smart Village AI
            </h1>

            <p>
              Ask me about village services
            </p>

          </div>

        </div>


        {/* ==========================
            MESSAGES
        ========================== */}

        <div className="chatbot-messages">


          {/* WELCOME */}

          {messages.length === 0 && (

            <div className="chatbot-welcome">

              <div className="welcome-icon">
                🤖
              </div>

              <h2>
                Hello! 👋
              </h2>

              <p>
                I am your Smart Village AI
                Assistant.
              </p>

              <p>
                Ask me about hospitals,
                pharmacies, schools, banks,
                colleges and other village
                services.
              </p>

            </div>

          )}


          {/* CHAT MESSAGES */}

          {messages.map(
            (chat, index) => (

              <div
                key={index}
                className={
                  chat.sender === "user"
                    ? "chat-message user-message"
                    : "chat-message ai-message"
                }
              >

                <div className="message-icon">

                  {chat.sender === "user"
                    ? "👤"
                    : "🤖"}

                </div>


                <div className="message-text">

                  {chat.text}

                </div>

              </div>

            )
          )}


          {/* LOADING */}

          {loading && (

            <div className="chat-message ai-message">

              <div className="message-icon">
                🤖
              </div>

              <div className="message-text">
                Thinking...
              </div>

            </div>

          )}

        </div>


        {/* ==========================
            INPUT
        ========================== */}

        <form
          className="chatbot-input-area"
          onSubmit={sendMessage}
        >

          <input
            type="text"
            placeholder="Ask something about your village..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />


          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>

        </form>


        {/* ==========================
            QUICK QUESTIONS
        ========================== */}

        <div className="chatbot-examples">

          <p>
            💡 Try asking:
          </p>


          <button
            type="button"
            onClick={() =>
              askQuestion(
                "What services are available?"
              )
            }
          >
            What services are available?
          </button>


          <button
            type="button"
            onClick={() =>
              askQuestion(
                "Show me hospitals"
              )
            }
          >
            🏥 Hospitals
          </button>


          <button
            type="button"
            onClick={() =>
              askQuestion(
                "Where can I find a pharmacy?"
              )
            }
          >
            💊 Pharmacy
          </button>


          <button
            type="button"
            onClick={() =>
              askQuestion(
                "Show me schools"
              )
            }
          >
            🏫 Schools
          </button>


          <button
            type="button"
            onClick={() =>
              askQuestion(
                "Show me banks"
              )
            }
          >
            🏦 Banks
          </button>

        </div>


      </div>

    </div>

  );
}

export default AIChatbot;