import { useEffect, useState } from "react";
import axios from "axios";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nip, setNip] = useState("");
  const [editingId, setEditingId] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:8000/api", // Laravel API
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Fetch teachers list
  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Add new teacher
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/teachers", { name, email, nip });
      setName("");
      setEmail("");
      setNip("");
      fetchTeachers();
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  // Edit teacher
  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setName(teacher.name);
    setEmail(teacher.email);
    setNip(teacher.nip);
  };

  // Update teacher
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/teachers/${editingId}`, { name, email, nip });
      setEditingId(null);
      setName("");
      setEmail("");
      setNip("");
      fetchTeachers();
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  // Delete teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Teachers</h2>

      <form onSubmit={editingId ? handleUpdate : handleAdd}>
        <input
          type="text"
          placeholder="Teacher Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Teacher Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Teacher NIP"
          value={nip}
          onChange={(e) => setNip(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
              setEmail("");
              setNip("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>NIP</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{t.email}</td>
              <td>{t.nip}</td>
              <td>
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {teachers.length === 0 && (
            <tr>
              <td colSpan="4">No teachers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Teachers;
