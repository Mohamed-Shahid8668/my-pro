import { useState } from "react";
import "./StudentForm.css"; // ✅ Import Amazon-style CSS

export default function StudentForm({ addStudent }) {
  const [formData, setFormData] = useState({ name: "", registerNumber: "", classYear: "", semester: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addStudent(formData);
    setFormData({ name: "", registerNumber: "", classYear: "", semester: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="text" name="registerNumber" placeholder="Register Number" value={formData.registerNumber} onChange={handleChange} required />
      <input type="text" name="classYear" placeholder="Class/Year" value={formData.classYear} onChange={handleChange} required />
      <input type="text" name="semester" placeholder="Semester" value={formData.semester} onChange={handleChange} required />
      <button type="submit" className="btn-add">Add Student</button>
    </form>
  );
}
