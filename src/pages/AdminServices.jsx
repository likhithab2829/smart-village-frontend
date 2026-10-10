import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminServices() {

  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const [serviceName, setServiceName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [available, setAvailable] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // GET SERVICES
  // ==========================================

  const getServices = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8092/api/village-services"
      );

      setServices(response.data);

    } catch (error) {

      console.error(
        "Error loading services:",
        error
      );

      alert("Unable to load services.");

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // PAGE LOAD
  // ==========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      navigate("/login");

      return;

    }

    const user =
      JSON.parse(storedUser);

    if (user.role !== "ADMIN") {

      alert("Access denied. Admin only.");

      navigate("/dashboard");

      return;

    }

    getServices();

  }, [navigate]);


  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {

    setServiceName("");
    setServiceType("");
    setLocation("");
    setContactNumber("");
    setAvailable(true);
    setEditingId(null);

  };


  // ==========================================
  // ADD / UPDATE SERVICE
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (
      serviceName.trim() === "" ||
      serviceType.trim() === ""
    ) {

      alert(
        "Service name and service type are required."
      );

      return;

    }


    const serviceData = {

      serviceName: serviceName,

      serviceType: serviceType,

      location: location,

      contactNumber: contactNumber,

      available: available

    };


    try {

      if (editingId === null) {

        await axios.post(
          "http://localhost:8092/api/village-services",
          serviceData
        );

        alert(
          "Service added successfully!"
        );

      } else {

        await axios.put(
          `http://localhost:8092/api/village-services/${editingId}`,
          serviceData
        );

        alert(
          "Service updated successfully!"
        );

      }


      clearForm();

      getServices();

    } catch (error) {

      console.error(
        "Save service error:",
        error
      );

      alert(
        "Unable to save service."
      );

    }

  };


  // ==========================================
  // EDIT SERVICE
  // ==========================================

  const editService = (service) => {

    setEditingId(service.id);

    setServiceName(
      service.serviceName || ""
    );

    setServiceType(
      service.serviceType || ""
    );

    setLocation(
      service.location || ""
    );

    setContactNumber(
      service.contactNumber || ""
    );

    setAvailable(
      service.available
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ==========================================
  // DELETE SERVICE
  // ==========================================

  const deleteService = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this service?"
      );

    if (!confirmDelete) {
      return;
    }


    try {

      await axios.delete(
        `http://localhost:8092/api/village-services/${id}`
      );

      alert(
        "Service deleted successfully!"
      );

      getServices();

    } catch (error) {

      console.error(
        "Delete service error:",
        error
      );

      alert(
        "Unable to delete service."
      );

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="admin-services-page">


      {/* ================= NAVBAR ================= */}

      <nav className="admin-navbar">

        <div className="admin-logo">
          🌱 Smart Village Admin
        </div>

        <div className="admin-nav">

          <button
            onClick={() =>
              navigate("/admin")
            }
          >
            Admin Dashboard
          </button>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= HEADER ================= */}

      <div className="admin-services-header">

        <h1>
          🏘️ Manage Village Services
        </h1>

        <p>
          Add, update and remove village services
        </p>

      </div>


      {/* ================= FORM ================= */}

      <div className="admin-service-form-container">

        <form
          className="admin-service-form"
          onSubmit={handleSubmit}
        >

          <h2>
            {editingId === null
              ? "➕ Add Service"
              : "✏️ Edit Service"}
          </h2>


          <label>
            Service Name
          </label>

          <input
            type="text"
            placeholder="Example: Village Hospital"
            value={serviceName}
            onChange={(e) =>
              setServiceName(e.target.value)
            }
            required
          />


          <label>
            Service Type
          </label>

          <input
            type="text"
            placeholder="Example: Hospital"
            value={serviceType}
            onChange={(e) =>
              setServiceType(e.target.value)
            }
            required
          />


          <label>
            Location
          </label>

          <input
            type="text"
            placeholder="Example: Main Road"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />


          <label>
            Contact Number
          </label>

          <input
            type="text"
            placeholder="Example: 9876543210"
            value={contactNumber}
            onChange={(e) =>
              setContactNumber(e.target.value)
            }
          />


          <label className="checkbox-label">

            <input
              type="checkbox"
              checked={available}
              onChange={(e) =>
                setAvailable(e.target.checked)
              }
            />

            Service Available

          </label>


          <div className="form-buttons">

            <button
              type="submit"
              className="save-service-btn"
            >
              {editingId === null
                ? "Add Service"
                : "Update Service"}
            </button>


            {editingId !== null && (

              <button
                type="button"
                className="cancel-service-btn"
                onClick={clearForm}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* ================= SERVICE LIST ================= */}

      <div className="admin-service-list">

        <h2>
          📋 Existing Services
        </h2>


        {loading ? (

          <p className="admin-message">
            Loading services...
          </p>

        ) : services.length === 0 ? (

          <p className="admin-message">
            No services available.
          </p>

        ) : (

          <div className="admin-service-grid">

            {services.map((service) => (

              <div
                className="admin-service-card"
                key={service.id}
              >

                <h3>
                  {service.serviceName}
                </h3>

                <p>
                  <strong>Type:</strong>{" "}
                  {service.serviceType}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {service.location || "-"}
                </p>

                <p>
                  <strong>Contact:</strong>{" "}
                  {service.contactNumber || "-"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}

                  {service.available
                    ? "Available"
                    : "Not Available"}

                </p>


                <div className="service-action-buttons">

                  <button
                    className="edit-service-btn"
                    onClick={() =>
                      editService(service)
                    }
                  >
                    Edit
                  </button>


                  <button
                    className="delete-service-btn"
                    onClick={() =>
                      deleteService(service.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}

export default AdminServices;