import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // =====================================
  // SMART RECOMMENDATION STATES
  // =====================================

  const [recommendationText, setRecommendationText] = useState("");

  const [recommendations, setRecommendations] = useState([]);

  const [recommendationLoading, setRecommendationLoading] =
    useState(false);


  // =====================================
  // CHECK LOGIN
  // =====================================

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


  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };


  // =====================================
  // SMART SERVICE RECOMMENDATION
  // =====================================

  const getRecommendations = async () => {

    // Check empty input

    if (recommendationText.trim() === "") {

      alert("Please enter what service you need.");

      return;
    }


    try {

      setRecommendationLoading(true);

      setRecommendations([]);


      // Call Spring Boot backend

      const response = await axios.get(
        "http://localhost:8092/api/recommendations",
        {
          params: {
            message: recommendationText
          }
        }
      );


      console.log(
        "Recommendation response:",
        response.data
      );


      // Store results

      setRecommendations(response.data);


    } catch (error) {

      console.error(
        "Recommendation error:",
        error
      );


      if (error.response) {

        console.error(
          "Backend error:",
          error.response.data
        );

        alert(
          "Unable to get recommendations.\n\n" +
          "Backend returned an error."
        );

      } else {

        alert(
          "Cannot connect to backend.\n\n" +
          "Please make sure Spring Boot is running on port 8092."
        );

      }

    } finally {

      setRecommendationLoading(false);

    }

  };


  // =====================================
  // DASHBOARD
  // =====================================

  return (

    <div className="dashboard-page">


      {/* =================================
          NAVBAR
      ================================= */}

      <nav className="dashboard-navbar">


        {/* LOGO */}

        <div className="dashboard-logo">

          🌱 Smart Village

        </div>


        {/* NAVIGATION BUTTONS */}

        <div className="dashboard-nav-buttons">


          {/* HOME */}

          <button
            onClick={() =>
              navigate("/")
            }
          >

            Home

          </button>


          {/* SERVICES */}

          <button
            onClick={() =>
              navigate("/services")
            }
          >

            Services

          </button>


          {/* LOGOUT */}

          <button
            onClick={handleLogout}
          >

            Logout

          </button>


        </div>

      </nav>



      {/* =================================
          WELCOME SECTION
      ================================= */}

      <section className="dashboard-welcome">


        <h1>

          Welcome, {user?.name || "User"} 👋

        </h1>


        <p>

          Welcome to your Smart Village dashboard.

        </p>


      </section>



      {/* =================================
          USER INFORMATION
      ================================= */}

      <section className="user-info-card">


        <h2>

          My Profile

        </h2>


        <div className="user-info">


          {/* NAME */}

          <p>

            <strong>Name:</strong>{" "}

            {user?.name}

          </p>


          {/* EMAIL */}

          <p>

            <strong>Email:</strong>{" "}

            {user?.email}

          </p>


          {/* PHONE */}

          <p>

            <strong>Phone:</strong>{" "}

            {user?.phone || "Not provided"}

          </p>


          {/* ROLE */}

          <p>

            <strong>Role:</strong>{" "}

            {user?.role}

          </p>


        </div>


      </section>



      {/* =================================
          SMART AI SERVICE RECOMMENDATIONS
      ================================= */}

      <section className="recommendation-section">


        {/* TITLE */}

        <h2>

          🤖 Smart Service Recommendations

        </h2>


        {/* DESCRIPTION */}

        <p>

          Tell us what service you need and
          we will find matching village services.

        </p>



        {/* =================================
            SEARCH AREA
        ================================= */}

        <div className="recommendation-search">


          {/* INPUT */}

          <input

            type="text"

            value={recommendationText}

            onChange={(e) =>
              setRecommendationText(e.target.value)
            }

            placeholder="Example: I need medicine for fever"

            onKeyDown={(e) => {

              if (e.key === "Enter") {

                getRecommendations();

              }

            }}

          />


          {/* SEARCH BUTTON */}

          <button

            onClick={getRecommendations}

            disabled={recommendationLoading}

          >

            {recommendationLoading

              ? "Finding..."

              : "🔍 Find Service"}

          </button>


        </div>



        {/* =================================
            LOADING MESSAGE
        ================================= */}

        {recommendationLoading && (

          <div className="recommendation-loading">

            <p>

              🤖 Finding suitable village services...

            </p>

          </div>

        )}



        {/* =================================
            RECOMMENDATION RESULTS
        ================================= */}

        {!recommendationLoading &&
          recommendations.length > 0 && (

            <div className="recommendation-results">


              <h3>

                Recommended Services

              </h3>



              {recommendations.map((service) => (

                <div

                  className="recommendation-card"

                  key={service.id}

                >


                  {/* SERVICE NAME */}

                  <h3>

                    🏠 {service.serviceName}

                  </h3>


                  {/* SERVICE TYPE */}

                  <p>

                    <strong>Type:</strong>{" "}

                    {service.serviceType}

                  </p>


                  {/* LOCATION */}

                  <p>

                    📍 <strong>Location:</strong>{" "}

                    {service.location || "Not provided"}

                  </p>


                  {/* PHONE */}

                  <p>

                    📞 <strong>Contact:</strong>{" "}

                    {service.contactNumber ||
                      "Not provided"}

                  </p>


                  {/* AVAILABILITY */}

                  <p>

                    <strong>Status:</strong>{" "}


                    {service.available

                      ? "✅ Available"

                      : "❌ Not Available"}

                  </p>


                </div>

              ))}


            </div>

          )}



        {/* =================================
            NO RESULTS
        ================================= */}

        {!recommendationLoading &&

          recommendationText.trim() !== "" &&

          recommendations.length === 0 && (

            <div className="no-recommendation">


              <p>

                😔 No matching service was found.

              </p>


              <p>

                Try asking for:

              </p>


              <ul>

                <li>🏥 Hospital</li>

                <li>💊 Pharmacy</li>

                <li>🏦 Bank</li>

                <li>🏫 School</li>

                <li>🎓 College</li>

                <li>🛒 Supermarket</li>

                <li>⚖️ Court</li>

                <li>🏛️ Government Office</li>

                <li>🚌 Transport</li>

                <li>🚑 Emergency Service</li>

              </ul>


            </div>

          )}


      </section>



      {/* =================================
          QUICK ACTIONS
      ================================= */}

      <section className="dashboard-actions">


        <h2>

          Quick Services

        </h2>



        <div className="dashboard-card-grid">



          {/* =================================
              VILLAGE SERVICES
          ================================= */}

          <div className="dashboard-card">


            <div className="dashboard-card-icon">

              🏘️

            </div>


            <h3>

              Village Services

            </h3>


            <p>

              Find hospitals, schools,
              banks, shops and other
              village services.

            </p>


            <button

              onClick={() =>
                navigate("/services")
              }

            >

              Explore Services

            </button>


          </div>



          {/* =================================
              COMPLAINTS
          ================================= */}

          <div className="dashboard-card">


            <div className="dashboard-card-icon">

              📝

            </div>


            <h3>

              Complaints

            </h3>


            <p>

              Submit a complaint about
              a village service.

            </p>


            <button

              onClick={() =>
                navigate("/complaint")
              }

            >

              Submit Complaint

            </button>


          </div>



          {/* =================================
              MY PROFILE
          ================================= */}

          <div className="dashboard-card">


            <div className="dashboard-card-icon">

              👤

            </div>


            <h3>

              My Profile

            </h3>


            <p>

              View your account details
              and personal information.

            </p>


            <button

              onClick={() =>
                window.scrollTo({
                  top: 300,
                  behavior: "smooth"
                })
              }

            >

              View Profile

            </button>


          </div>



          {/* =================================
              SMART AI ASSISTANT
          ================================= */}

          <div className="dashboard-card">


            <div className="dashboard-card-icon">

              🤖

            </div>


            <h3>

              Smart AI Assistant

            </h3>


            <p>

              Ask questions about village
              services and get smart assistance.

            </p>


            <button

              onClick={() =>
                navigate("/ai-chat")
              }

            >

              Ask AI

            </button>


          </div>



          {/* =================================
              SMART VILLAGE HOME
          ================================= */}

          <div className="dashboard-card">


            <div className="dashboard-card-icon">

              🏠

            </div>


            <h3>

              Smart Village Home

            </h3>


            <p>

              Go back to the Smart Village
              home page.

            </p>


            <button

              onClick={() =>
                navigate("/")
              }

            >

              Go Home

            </button>


          </div>


        </div>


      </section>



      {/* =================================
          FOOTER
      ================================= */}

      <footer className="dashboard-footer">


        <p>

          © 2026 Smart Village Service Platform

        </p>


      </footer>


    </div>

  );

}


export default Dashboard;