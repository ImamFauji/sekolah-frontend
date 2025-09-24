import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    nis: "",
    email: "",
    phone: "",
    school_class_id: "",
  });

  useEffect(() => {
    load();
    loadClasses();
  }, []);

  async function load() {
    const res = await api.get("/students");
    setStudents(res.data);
  }

  async function loadClasses() {
    const res = await api.get("/classes");
    setClasses(res.data);
  }

  async function submit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        // update
        await api.put(`/students/${editingId}`, form);
        setEditingId(null);
      } else {
        // create
        await api.post("/students", form);
      }
      setForm({ name: "", nis: "", email: "", phone: "", school_class_id: "" });
      load();
    } catch (err) {
      console.error("Error save student:", err.response?.data || err.message);
    }
  }

  function handleEdit(student) {
    setEditingId(student.id);
    setForm({
      name: student.name,
      nis: student.nis,
      email: student.email || "",
      phone: student.phone || "",
      school_class_id: student.school_class_id || "",
    });
  }

  async function remove(id) {
    if (!window.confirm("Hapus siswa?")) return;
    try {
      await api.delete(`/students/${id}`);
      load();
    } catch (err) {
      console.error("Error delete student:", err.response?.data || err.message);
    }
  }

  function handleCancel() {
    setEditingId(null);
    setForm({ name: "", nis: "", email: "", phone: "", school_class_id: "" });
  }

  return (
    <div className="container mt-4">
      <h3>Management Siswa</h3>
      <form className="mb-3" onSubmit={submit}>
        <div className="row g-2">
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="NIS"
              value={form.nis}
              onChange={(e) => setForm({ ...form, nis: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Nama"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="No HP"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-control"
              value={form.school_class_id}
              onChange={(e) =>
                setForm({ ...form, school_class_id: e.target.value })
              }
              required
            >
              <option value="">-- Pilih Kelas --</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2">
          <button className="btn btn-primary">
            {editingId ? "Update" : "Tambah Murid"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={handleCancel}
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>NIS</th>
            <th>Nama</th>
            <th>Email</th>
            <th>No HP</th>
            <th>Kelas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.nis}</td>
              <td>{s.name}</td>
              <td>{s.email || "-"}</td>
              <td>{s.phone || "-"}</td>
              <td>{s.class ? s.class.name : "-"}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="6">Belum ada siswa</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
