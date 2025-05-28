import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/css/Evidence.css"; // Adjust path if needed

const EvidencePage = () => {
  const username = localStorage.getItem("username") || "Unknown";
  
  const [form, setForm] = useState({
    id: "",
    witness_first_name: "",
    witness_last_name: "",
    victim_first_name: "",
    victim_last_name: "",
    image: "",
    forensic_report: "",
    case_id: "",
    submitted_by: username,
  });

  const [evidences, setEvidences] = useState([]);
  const [caseIds, setCaseIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvidences();
    fetchCaseIds();
  }, []);

  const fetchEvidences = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/evidences");
      setEvidences(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setEvidences([]);
      alert("Failed to fetch evidences");
    }
    setLoading(false);
  };

  const fetchCaseIds = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/court-cases");
      setCaseIds(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setCaseIds([]);
      alert("Failed to fetch case IDs");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...form,
        submitted_by: username,
      };

      if (form.id) {
        await axios.put(`http://localhost:8000/evidences/${form.id}`, submissionData);
        alert("Evidence updated successfully!");
      } else {
        await axios.post("http://localhost:8000/evidences", submissionData);
        alert("Evidence inserted successfully!");
      }

      setForm({
        id: "",
        witness_first_name: "",
        witness_last_name: "",
        victim_first_name: "",
        victim_last_name: "",
        image: "",
        forensic_report: "",
        case_id: "",
        submitted_by: username,
      });

      fetchEvidences();
    } catch (err) {
      alert("Failed to save evidence");
      console.error(err);
    }
  };

  const handleEdit = (ev) => {
    setForm({
      id: ev.id,
      witness_first_name: ev.witness_first_name,
      witness_last_name: ev.witness_last_name,
      victim_first_name: ev.victim_first_name,
      victim_last_name: ev.victim_last_name,
      image: ev.image,
      forensic_report: ev.forensic_report,
      case_id: ev.case_id,
      submitted_by: ev.submitted_by || username,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this evidence?")) return;
    try {
      await axios.delete(`http://localhost:8000/handleDelete/${id}`);
      setEvidences(evidences.filter((evidence) => evidence.id !== id));
      alert("Evidence deleted successfully!");
    } catch (err) {
      alert("Failed to delete evidence");
      console.error("Error deleting evidence:", err);
    }
  };

  return (
    <div className="evidence-page">
      <h2>{form.id ? "Edit Evidence" : "Add New Evidence"}</h2>
      <form onSubmit={handleSubmit} className="evidence-form">
        <div>
          <label>Witness First Name:</label>
          <input name="witness_first_name" value={form.witness_first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Witness Last Name:</label>
          <input name="witness_last_name" value={form.witness_last_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Victim First Name:</label>
          <input name="victim_first_name" value={form.victim_first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Victim Last Name:</label>
          <input name="victim_last_name" value={form.victim_last_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Image URL:</label>
          <input name="image" value={form.image} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="forensic_report" value={form.forensic_report} onChange={handleChange} required />
        </div>
        <div>
          <label>Case ID:</label>
          <select name="case_id" value={form.case_id} onChange={handleChange} required>
            <option value="">Select Case ID</option>
            {caseIds && caseIds.map((caseItem) => (
              <option key={caseItem.case_id} value={caseItem.case_id}>
                {caseItem.case_id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Submitted By:</label>
          <input name="submitted_by" value={username} readOnly />
        </div>
        <button type="submit">{form.id ? "Update Evidence" : "Add Evidence"}</button>
      </form>

      <h2>All Evidences</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="evidence-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Witness</th>
              <th>Victim</th>
              <th>Image</th>
              <th>Forensic Report</th>
              <th>Case ID</th>
              <th>Submitted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {evidences.length === 0 ? (
              <tr>
                <td colSpan="8">No evidence records available.</td>
              </tr>
            ) : (
              evidences.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.id}</td>
                  <td>{ev.witness_first_name} {ev.witness_last_name}</td>
                  <td>{ev.victim_first_name} {ev.victim_last_name}</td>
                  <td>
                    {ev.image && (
                      <a href={ev.image} target="_blank" rel="noopener noreferrer">
                        <img src={ev.image} alt="evidence" style={{ width: "100px" }} />
                      </a>
                    )}
                  </td>
                  <td>{ev.forensic_report}</td>
                  <td>{ev.case_id}</td>
                  <td>{ev.submitted_by}</td>
                  <td>
                    <button onClick={() => handleEdit(ev)}>Edit</button>
                    <button onClick={() => handleDelete(ev.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EvidencePage;