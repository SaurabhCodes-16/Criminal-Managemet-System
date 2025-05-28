import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddCriminal.css'; 

const CriminalList = () => {
  const [criminals, setCriminals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCriminals = async () => {
    try {
      const response = await axios.get("http://localhost:8000/criminals");
      setCriminals(response.data);
    } catch (error) {
      console.error("Error fetching criminals:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this criminal?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:8000/delete/${id}`);
      if (response.data.success) {
        setCriminals((prev) => prev.filter((c) => c.id !== id));
        alert("Criminal deleted successfully");
      } else {
        alert("Failed to delete criminal");
      }
    } catch (error) {
      console.error("Error deleting criminal:", error);
      alert("Error occurred while deleting");
    }
  };

  useEffect(() => {
    fetchCriminals();
  }, []);

  const filteredCriminals = criminals.filter((criminal) => {
    const lower = searchTerm.toLowerCase();
    return (
      criminal.FirstName.toLowerCase().includes(lower) ||
      criminal.LastName.toLowerCase().includes(lower) ||
      criminal.crime.toLowerCase().includes(lower) 
        // ✅ Added filter for crime_committed
    );
  });

  return (
    <div className="criminal-list-container">
      <h2>Criminal Records</h2>

      <input
        type="text"
        placeholder="Search by name, crime, or crime date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />

      <table className="criminal-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Age</th>
            <th>Crime</th>
            <th>DOB</th>
            <th>Crime Date</th> {/* ✅ Added Crime Date Column */}
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCriminals.map((criminal) => (
            <tr key={criminal.id}>
              <td>{criminal.id}</td>
              <td>{criminal.FirstName}</td>
              <td>{criminal.LastName}</td>
              <td>{criminal.age}</td>
              <td>{criminal.crime}</td>
              <td>{criminal.dob?.split('T')[0]}</td>
              <td>{criminal.dateofcrime
                      ? new Date(criminal.dateofcrime).toLocaleDateString()
                      : "Not Set"}</td>
              <td>{criminal.Address}</td>
              <td>
                <button onClick={() => handleDelete(criminal.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CriminalList;
