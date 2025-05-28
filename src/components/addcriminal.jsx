import React, { useState } from 'react';
import axios from 'axios';
import './AddCriminal.css';  // Import the CSS file

const AddCriminal = () => {
  // State for form inputs
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [crime, setCrime] = useState('');
  const [dob, setDob] = useState('');
  const [Address, setAddress] = useState('');
  const [crimeDate, setCrimeDate] = useState('');  // ✅ New state for Date of Crime

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if the required fields are filled
    if (!FirstName || !LastName || !age || !crime || !dob || !Address || !crimeDate) {
      alert("All fields are required!");
      return;
    }

    // Post data to the backend to add the criminal
    try {
      const response = await axios.post("http://localhost:8000/add", {
        FirstName,
        LastName,
        age,
        crime,
        dob,
        Address,
       crimeDate // ✅ Include in request
      });

      if (response.data.success) {
        alert("Criminal added successfully!");
        // Clear the form
        setFirstName('');
        setLastName('');
        setAge('');
        setCrime('');
        setDob('');
        setAddress('');
        setCrimeDate('');
      } else {
        alert("Failed to add criminal");
      }
    } catch (error) {
      console.error("Error adding criminal:", error);
      alert("Error occurred while adding criminal");
    }
  };

  return (
    <div className="add-criminal-wrapper">
      <div className="add-criminal-box">
        <h2>Add Criminal</h2>
        <form onSubmit={handleSubmit} className="add-criminal-form">
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={FirstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={LastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Crime:</label>
            <input
              type="text"
              value={crime}
              onChange={(e) => setCrime(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Crime Committed:</label>  {/* ✅ New Input Field */}
            <input
              type="date"
              value={crimeDate}
              onChange={(e) => setCrimeDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" className="submit-btn">Add Criminal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCriminal;
