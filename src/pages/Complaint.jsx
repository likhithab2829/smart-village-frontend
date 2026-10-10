import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Complaint() {

  const navigate = useNavigate();

  // ==========================================
  // USER
  // ==========================================

  const [user, setUser] = useState(null);

  // ==========================================
  // COMPLAINT
  // ==========================================

  const [complaintText, setComplaintText] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // AI
  // ==========================================

  const [aiResult, setAiResult] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);


  // ==========================================
  // CHECK LOGIN
  // ==========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      navigate("/login");

      return;
    }

    try {

      const loggedInUser =
        JSON.parse(storedUser);

      setUser(loggedInUser);

    } catch (error) {

      console.error(
        "Invalid user data:",
        error
      );

      localStorage.removeItem("user");

      navigate("/login");
    }

  }, [navigate]);


  // ==========================================
  // AI COMPLAINT ANALYSIS
  // ==========================================

  const handleAIAnalysis = async () => {

    // Check complaint
    if (complaintText.trim() === "") {

      alert(
        "Please enter your complaint first."
      );

      return;
    }

    try {

      setAiLoading(true);

      setAiResult(null);

      console.log(
        "Sending complaint to AI:",
        complaintText
      );


      const response = await axios.post(

        "http://localhost:8092/api/complaint-ai/classify",

        {
          complaintText: complaintText
        }

      );


      console.log(
        "AI response:",
        response.data
      );


      setAiResult(response.data);

    } catch (error) {

      console.error(
        "AI classification error:",
        error
      );


      if (error.response) {

        alert(
          "AI classification failed.\n\n" +
          JSON.stringify(
            error.response.data
          )
        );

      } else {

        alert(
          "Cannot connect to AI service.\n\n" +
          "Please make sure Spring Boot and Ollama are running."
        );
      }

    } finally {

      setAiLoading(false);

    }
  };


  // ==========================================
  // SUBMIT COMPLAINT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // Check complaint
    if (complaintText.trim() === "") {

      alert(
        "Please enter your complaint."
      );

      return;
    }


    // Check user
    if (!user) {

      alert(
        "Please login first."
      );

      navigate("/login");

      return;
    }


    // Complaint data
    const complaintData = {

      userId: user.userId,

      complaintText: complaintText,

      status: "PENDING"

    };


    console.log(
      "Submitting complaint:",
      complaintData
    );


    try {

      setLoading(true);


      await axios.post(

        "http://localhost:8092/api/complaints",

        complaintData

      );


      alert(
        "Complaint submitted successfully!"
      );


      // Clear form
      setComplaintText("");

      setAiResult(null);


      // Go to My Complaints
      navigate("/my-complaints");


    } catch (error) {

      console.error(
        "Complaint submission error:",
        error
      );


      if (error.response) {

        alert(
          "Failed to submit complaint:\n\n" +
          JSON.stringify(
            error.response.data
          )
        );

      } else {

        alert(
          "Cannot connect to the backend."
        );
      }

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="complaint-page">


      {/* ======================================
          NAVBAR
          ====================================== */}

      <nav className="dashboard-navbar">


        {/* LOGO */}

        <div className="dashboard-logo">

          🌱 Smart Village

        </div>


        {/* NAVIGATION */}

        <div className="dashboard-nav-buttons">


          {/* DASHBOARD */}

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >

            Dashboard

          </button>


          {/* SERVICES */}

          <button
            onClick={() =>
              navigate("/services")
            }
          >

            Services

          </button>


          {/* MY COMPLAINTS */}

          <button
            onClick={() =>
              navigate("/my-complaints")
            }
          >

            My Complaints

          </button>


        </div>

      </nav>


      {/* ======================================
          COMPLAINT CONTAINER
          ====================================== */}

      <div className="complaint-container">


        <div className="complaint-card">


          {/* TITLE */}

          <h1>

            📝 Submit a Complaint

          </h1>


          {/* DESCRIPTION */}

          <p>

            Tell us about a problem with a
            village service.

          </p>


          {/* ==================================
              FORM
              ================================== */}

          <form
            onSubmit={handleSubmit}
          >


            {/* LABEL */}

            <label>

              Your Complaint

            </label>


            {/* TEXTAREA */}

            <textarea

              value={complaintText}

              onChange={(e) => {

                setComplaintText(
                  e.target.value
                );

                // Clear old AI result
                setAiResult(null);

              }}

              placeholder="Enter your complaint here..."

              rows="7"

              required

            />


            {/* ==================================
                AI ANALYSIS BUTTON
                ================================== */}

            <button

              type="button"

              className="ai-analysis-btn"

              onClick={handleAIAnalysis}

              disabled={aiLoading}

            >

              {aiLoading

                ? "🤖 Analyzing..."

                : "🤖 Analyze Complaint with AI"

              }

            </button>


            {/* ==================================
                AI RESULT
                ================================== */}

            {aiResult && (

              <div className="ai-result-box">


                <h2>

                  🤖 AI Analysis

                </h2>


                {/* CATEGORY */}

                <p>

                  <strong>
                    Category:
                  </strong>

                  {" "}

                  {aiResult.category}

                </p>


                {/* PRIORITY */}

                <p>

                  <strong>
                    Priority:
                  </strong>

                  {" "}

                  {aiResult.priority}

                </p>


                {/* EXPLANATION */}

                <p>

                  <strong>
                    Explanation:
                  </strong>

                  {" "}

                  {aiResult.explanation}

                </p>


              </div>

            )}


            {/* ==================================
                SUBMIT BUTTON
                ================================== */}

            <button

              type="submit"

              disabled={loading}

            >

              {loading

                ? "Submitting..."

                : "Submit Complaint"

              }

            </button>


          </form>


          {/* ==================================
              BACK BUTTON
              ================================== */}

          <button

            className="back-dashboard-btn"

            onClick={() =>
              navigate("/dashboard")
            }

          >

            ← Back to Dashboard

          </button>


        </div>

      </div>

    </div>

  );

}

export default Complaint;