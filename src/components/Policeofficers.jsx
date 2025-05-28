import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/policeofficer.css";

const PoliceOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newOfficer, setNewOfficer] = useState({
    name: "",
    badge_number: "",
    officer_rank: "",
    contact_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch police officers data
  const fetchOfficers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/viewPolice");
      setOfficers(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch police officers");
      setLoading(false);
    }
  };

  // Add new police officer
  const addOfficer = async () => {
    // Check if badge number already exists in the officers list
    const badgeExists = officers.some(
      (officer) => officer.badge_number === newOfficer.badge_number
    );
  
    if (badgeExists) {
      alert("Badge number already exists. Please enter a unique badge number.");
      return; // Stop the rest of the code from executing
    }
  
    try {
      const res = await axios.post("http://localhost:8000/addOfficer", newOfficer);
      setOfficers([...officers, res.data]); // Add the newly created officer to the list
      setNewOfficer({ name: "", badge_number: "", officer_rank: "", contact_number: "" }); // Clear form
    } catch (err) {
      console.error("Error adding officer:", err);
    }
  };
  
  
  

  // Delete police officer
  const deleteOfficer = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/deleteOfficer/${id}`);
      setOfficers(officers.filter((officer) => officer.id !== id)); // Remove officer from list
    } catch (err) {
      console.error("Error deleting officer:", err);
    }
  };

  // Search officers based on name, rank, or ID
  const filteredOfficers = officers.filter((officer) => {
    return (
      officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.officer_rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.id.toString().includes(searchQuery)
    );
  });

  // Handle input change for new officer form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOfficer({ ...newOfficer, [name]: value });
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  if (loading) {
    return <div>Loading police officers...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="police-officers-container">
      <h2>Police Officers</h2>

      {/* Add Officer Form */}
      <div className="add-officer-form">
        <h3>Add New Officer</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={newOfficer.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Badge Number"
            name="badge_number"
            value={newOfficer.badge_number}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Rank"
            name="officer_rank"
            value={newOfficer.officer_rank}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Contact Number"
            name="contact_number"
            value={newOfficer.contact_number}
            onChange={handleInputChange}
          />
        </div>
        <button onClick={addOfficer}>Add Officer</button>
      </div>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by Name, Rank, or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table for Officers */}
      <table className="police-officers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Badge Number</th>
            <th>Officer Rank</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOfficers.length === 0 ? (
            <tr>
              <td colSpan="6">No officers found</td>
            </tr>
          ) : (
            filteredOfficers.map((officer) => (
              <tr key={officer.id}>
                <td>{officer.id}</td>
                <td>{officer.name}</td>
                <td>{officer.badge_number}</td>
                <td>{officer.officer_rank}</td>
                <td>{officer.contact_number}</td>
                <td>
                  <button onClick={() => deleteOfficer(officer.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PoliceOfficers;
