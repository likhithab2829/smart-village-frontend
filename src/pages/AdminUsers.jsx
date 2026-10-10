import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminUsers() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);


  // =========================================
  // CHECK ADMIN
  // =========================================

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


      if (loggedInUser.role !== "ADMIN") {

        alert(
          "Admin access required."
        );

        navigate("/dashboard");

        return;
      }


      getUsers();

    } catch (error) {

      localStorage.removeItem("user");

      navigate("/login");
    }

  }, [navigate]);


  // =========================================
  // GET USERS
  // =========================================

  const getUsers = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:8092/api/users"
        );


      setUsers(response.data);

    } catch (error) {

      console.error(
        "Error loading users:",
        error
      );

      alert(
        "Unable to load users."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================
  // DELETE USER
  // =========================================

  const handleDelete = async (userId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await axios.delete(
        `http://localhost:8092/api/users/${userId}`
      );


      alert(
        "User deleted successfully!"
      );


      getUsers();

    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );


      alert(
        "Unable to delete user."
      );
    }
  };


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");
  };


  // =========================================
  // SEARCH
  // =========================================

  const filteredUsers =
    users.filter((user) => {

      const searchText =
        search.toLowerCase();


      return (

        user.name
          ?.toLowerCase()
          .includes(searchText)

        ||

        user.email
          ?.toLowerCase()
          .includes(searchText)

        ||

        user.role
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="admin-users-page">


      {/* NAVBAR */}

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">

          🌱 Smart Village Admin

        </div>


        <div className="dashboard-nav-buttons">

          <button
            onClick={() =>
              navigate("/admin")
            }
          >
            Admin Dashboard
          </button>


          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* HEADER */}

      <div className="admin-users-header">

        <h1>
          👥 User Management
        </h1>

        <p>
          View and manage registered village users.
        </p>

      </div>


      {/* SEARCH */}

      <div className="admin-users-search">

        <input
          type="text"
          placeholder="🔍 Search by name, email or role..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* USERS */}

      <div className="admin-users-container">

        {loading ? (

          <h3>
            Loading users...
          </h3>

        ) : filteredUsers.length === 0 ? (

          <div className="no-admin-users">

            <h2>
              No users found.
            </h2>

            <p>
              No registered users match your search.
            </p>

          </div>

        ) : (

          <div className="admin-users-grid">

            {filteredUsers.map((user) => (

              <div
                className="admin-user-card"
                key={user.userId}
              >

                <div className="admin-user-icon">
                  👤
                </div>


                <h2>
                  {user.name}
                </h2>


                <p>

                  <strong>
                    User ID:
                  </strong>{" "}

                  {user.userId}

                </p>


                <p>

                  <strong>
                    Email:
                  </strong>{" "}

                  {user.email}

                </p>


                <p>

                  <strong>
                    Phone:
                  </strong>{" "}

                  {user.phone ||
                    "Not provided"}

                </p>


                <p>

                  <strong>
                    Role:
                  </strong>{" "}

                  <span
                    className={
                      user.role === "ADMIN"
                        ? "admin-role"
                        : "user-role"
                    }
                  >
                    {user.role}
                  </span>

                </p>


                <button
                  className="delete-user-btn"
                  onClick={() =>
                    handleDelete(
                      user.userId
                    )
                  }
                >
                  🗑️ Delete User
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}

export default AdminUsers;