import { useState, useEffect } from "react";

export default function App() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodFilter, setBloodFilter] = useState("All");
  const [requests, setRequests] = useState({});

  const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        const mappedDonors = data.map((user, index) => ({
          id: user.id,
          name: user.name,
          city: user.address.city,
          blood: bloodGroups[index % bloodGroups.length],
          available: Math.random() > 0.3,
        }));

        setDonors(mappedDonors);
        setLoading(false);
      });
  }, []);

  const handleRequest = (id) => {
    setRequests((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const filteredDonors =
    bloodFilter === "All"
      ? donors
      : donors.filter((d) => d.blood === bloodFilter);

  const availableCount = filteredDonors.filter((d) => d.available).length;

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading donors...</h2>;
  }

  return (
    <div
      style={{
        fontFamily: "Arial",
        maxWidth: "700px",
        margin: "auto",
        padding: "30px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>🩸 Blood Donor Finder</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <h3>Available Donors: {availableCount}</h3>

        <select
          value={bloodFilter}
          onChange={(e) => setBloodFilter(e.target.value)}
          style={{ padding: "6px", borderRadius: "5px" }}
        >
          <option value="All">All</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
      </div>

      {filteredDonors.length === 0 && <p>No donors found</p>}

      {filteredDonors.map((donor) => (
        <div
          key={donor.id}
          style={{
            border: "1px solid #eee",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "12px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: "0 0 6px 0" }}>{donor.name}</h3>

          <p style={{ margin: "3px 0" }}>Blood Group: {donor.blood}</p>
          <p style={{ margin: "3px 0" }}>City: {donor.city}</p>
          <p style={{ margin: "3px 0" }}>
            Availability: {donor.available ? "Available" : "Not Available"}
          </p>

          <button
            onClick={() => handleRequest(donor.id)}
            disabled={requests[donor.id]}
            style={{
              marginTop: "8px",
              padding: "7px 12px",
              border: "none",
              borderRadius: "6px",
              background: requests[donor.id] ? "#4CAF50" : "#e53935",
              color: "white",
              cursor: requests[donor.id] ? "default" : "pointer",
            }}
          >
            {requests[donor.id] ? "Request Sent ✅" : "Request Help"}
          </button>
        </div>
      ))}
    </div>
  );
}