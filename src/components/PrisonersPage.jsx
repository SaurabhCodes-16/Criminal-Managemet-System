// src/prisoners.js (or src/PrisonersPage.js)
import React, { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import "../components/css/PrisonersPage.css";


const PrisonersPage = () => { // Capitalize the component name
  const [prisoners, setPrisoners] = useState([]);

  useEffect(() => {
    const fetchPrisoners = async () => {
        try {
            const response = await fetch('http://localhost:8000/prisoners'); // Ensure this matches your backend URL
            if (!response.ok) {
                throw new Error('Failed to fetch prisoners');
            }
            const data = await response.json();
            setPrisoners(data);
        } catch (error) {
            console.error("Error fetching prisoners:", error);
            setError("Failed to fetch prisoners");
        }
    };
    fetchPrisoners();
}, []);


return (
  <div className="page-container">
    <h2>Prisoners List</h2>
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Criminal ID</th>
            <th>Name</th>
            <th>Crime</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {prisoners.length > 0 ? (
            prisoners.map((prisoner) => (
              <tr key={prisoner.case_id}>
                <td>{prisoner.case_id}</td>
                <td>{prisoner.criminal_id}</td>
                <td>{`${prisoner.FirstName} ${prisoner.LastName}`}</td>
                <td>{prisoner.crime}</td>
                <td>{prisoner.prisoner_status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No prisoners found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default PrisonersPage;