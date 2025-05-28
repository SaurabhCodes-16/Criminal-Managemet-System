import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/CourtCases.css";

const CourtCases = () => {
  const [courtCases, setCourtCases] = useState([]);
  const [criminals, setCriminals] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [form, setForm] = useState({
    criminal_id: "",
    police_officer_id: "",
    case_status: "active",
    prisoner_status: "prisoner",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cases = await axios.get("http://localhost:8000/viewCourtCases");
      const criminals = await axios.get("http://localhost:8000/criminals");
      const officers = await axios.get("http://localhost:8000/viewPolice");
      setCourtCases(cases.data);
      setCriminals(criminals.data);
      setOfficers(officers.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = async (case_id, currentCaseStatus, currentPrisonerStatus, toggleType) => {
    const newCaseStatus = toggleType === "case_status"
      ? currentCaseStatus === "active" ? "closed" : "active"
      : currentCaseStatus;

    const newPrisonerStatus = toggleType === "prisoner_status"
      ? currentPrisonerStatus === "prisoner" ? "bailed" : "prisoner"
      : currentPrisonerStatus;

    try {
      await axios.put(`http://localhost:8000/updateCourtCase/${case_id}`, {
        case_status: newCaseStatus,
        prisoner_status: newPrisonerStatus,
      });
      alert("Court case updated successfully!");
      fetchData();
    } catch (error) {
      alert("Failed to update status in database");
      console.error("Update error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.criminal_id) return alert("Select a criminal");

    try {
      await axios.post("http://localhost:8000/addCourtCase", form);
      fetchData();
      alert("Court case added!");
      setForm({
        criminal_id: "",
        police_officer_id: "",
        case_status: "active",
        prisoner_status: "prisoner",
      });
    } catch (err) {
      alert("Failed to add court case");
      console.error(err);
    }
  };

  return (
    <div className="court-cases-container">
      <h2 className="court-cases-title">⚖️ Court Cases</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-2">
        <select
          name="criminal_id"
          value={form.criminal_id}
          onChange={handleChange}
          className="bg-gray-800 p-2 rounded"
        >
          <option value="">Select Criminal ID</option>
          {criminals.map((c) => (
            <option key={c.id} value={c.id}>
              ID : {c.id}
            </option>
          ))}
        </select>

        <select
          name="police_officer_id"
          value={form.police_officer_id}
          onChange={handleChange}
          className="bg-gray-800 p-2 rounded"
        >
          <option value="">Assign Officer</option>
          {officers.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-800 col-span-2 p-2 rounded text-white font-semibold"
        >
          ➕ Add Court Case
        </button>
      </form>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm bg-gray-900 border border-gray-700 rounded">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="p-2">Case ID</th>
              <th className="p-2">Criminal</th>
              <th className="p-2">Officer</th>
              <th className="p-2">Status</th>
              <th className="p-2">Prisoner</th>
            </tr>
          </thead>
          <tbody>
            {courtCases.map((cc) => (
              <tr key={cc.case_id} className="border-t border-gray-700">
                <td className="p-2">{cc.case_id}</td>
                <td className="p-2">
                  {cc.criminal_firstname} {cc.criminal_lastname}
                </td>
                <td className="p-2">{cc.officer_name || "N/A"}</td>
                <td className="p-2">
                  <button
                    onClick={() =>
                      handleToggle(cc.case_id, cc.case_status, cc.prisoner_status, "case_status")
                    }
                    className={`px-2 py-1 rounded ${
                      cc.case_status === "active" ? "bg-green-700" : "bg-gray-600"
                    }`}
                  >
                    {cc.case_status}
                  </button>
                </td>

                <td className="p-2">
                  <button
                    onClick={() =>
                      handleToggle(cc.case_id, cc.case_status, cc.prisoner_status, "prisoner_status")
                    }
                    className={`px-2 py-1 rounded ${
                      cc.prisoner_status === "prisoner" ? "bg-red-700" : "bg-yellow-600"
                    }`}
                  >
                    {cc.prisoner_status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourtCases;
