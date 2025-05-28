import React, { useEffect, useState } from "react";
import axios from "axios";
import '../components/css/viewcrimes.css';

const crimeCategories = {
  violent: ["Murder", "Assault", "Sexual Assault", "Robbery"],
  property: ["Burglary", "Larceny", "Arson", "Vandalism"],
  whiteCollar: ["Fraud", "Embezzlement", "Bribery", "Cyber Crime"],
};

const ViewCrimes = () => {
  const [activeCategory, setActiveCategory] = useState("violent");
  const [selectedCrimeType, setSelectedCrimeType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [criminals, setCriminals] = useState([]);

  const fetchCriminals = async () => {
    try {
      const res = await axios.get("http://localhost:8000/criminals");
      setCriminals(res.data);
    } catch (error) {
      console.error("Error fetching criminals:", error);
    }
  };

  useEffect(() => {
    fetchCriminals();
  }, []);

  const filterCriminals = () => {
    return criminals.filter((criminal) => {
      const fullName = `${criminal.FirstName} ${criminal.LastName}`.toLowerCase();
      const location = criminal.Address.toLowerCase();
      const crimeMatch = criminal.crime.toLowerCase();

      const matchesCategory =
        activeCategory === "all" ||
        crimeCategories[activeCategory]?.some((type) =>
          crimeMatch.includes(type.toLowerCase())
        );

      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        location.includes(searchTerm.toLowerCase());

      const matchesType =
        selectedCrimeType === "" ||
        crimeMatch.includes(selectedCrimeType.toLowerCase());

      return matchesCategory && matchesSearch && matchesType;
    });
  };

  const filteredCriminals = filterCriminals();

  return (
    <div className="view-crimes-container">
      <h2>View Crimes</h2>

      <div className="button-group">
        <button onClick={() => { setActiveCategory("violent"); setSelectedCrimeType(""); }}>
          Violent Crimes
        </button>
        <button onClick={() => { setActiveCategory("property"); setSelectedCrimeType(""); }}>
          Property Crimes
        </button>
        <button onClick={() => { setActiveCategory("whiteCollar"); setSelectedCrimeType(""); }}>
          White-Collar Crimes
        </button>
        <button onClick={() => { setActiveCategory("all"); setSelectedCrimeType(""); }}>
          All Crimes
        </button>
      </div>

      {activeCategory !== "all" && (
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedCrimeType}
            onChange={(e) => setSelectedCrimeType(e.target.value)}
          >
            <option value="">
              All {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Crime Types
            </option>
            {crimeCategories[activeCategory].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="crime-box">
        <table className="crime-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Crime</th>
              <th>Date of Birth</th>
              <th>Address</th>
              <th>Date of Crime</th> {/* New column for dateofcrime */}
            </tr>
          </thead>
          <tbody>
            {filteredCriminals.length === 0 ? (
              <tr>
                <td colSpan="8">No criminals found for this category.</td>
              </tr>
            ) : (
              filteredCriminals.map((criminal) => (
                <tr key={criminal.id}>
                  <td>{criminal.id}</td>
                  <td>{criminal.FirstName}</td>
                  <td>{criminal.LastName}</td>
                  <td>{criminal.age}</td>
                  <td>{criminal.crime}</td>
                  <td>{new Date(criminal.dob).toLocaleDateString()}</td>
                  <td>{criminal.Address}</td>
                  <td>
                    {criminal.dateofcrime
                      ? new Date(criminal.dateofcrime).toLocaleDateString()
                      : "Not Set"} {/* Displaying dateofcrime */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewCrimes;
