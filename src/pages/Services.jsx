import { useEffect, useState } from "react";
import axios from "axios";

function Services() {

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getServices = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8092/api/village-services"
      );

      setServices(response.data);

    } catch (error) {

      console.error("Error loading services:", error);
      alert("Unable to load village services.");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.serviceName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="services-page">

      <div className="services-header">

        <h1>🌱 Village Services</h1>

        <p>
          Find important services available in your village
        </p>

        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {loading ? (

        <h3 className="loading">
          Loading services...
        </h3>

      ) : filteredServices.length === 0 ? (

        <h3 className="loading">
          No services found.
        </h3>

      ) : (

        <div className="service-list">

          {filteredServices.map((service) => (

            <div
              className="service-item"
              key={service.id}
            >

              <div className="service-item-icon">
                🏘️
              </div>

              <h2>
                {service.serviceName}
              </h2>

              <p>
                <strong>Type:</strong>{" "}
                {service.serviceType}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {service.location}
              </p>

              <p>
                <strong>Contact:</strong>{" "}
                {service.contactNumber}
              </p>

              <p>
                <strong>Status:</strong>{" "}

                {service.available
                  ? "Available"
                  : "Not Available"}

              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Services;