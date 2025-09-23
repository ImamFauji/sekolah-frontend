import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
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
    await api.post("/students", form);
    setForm({ name: "", nis: "", email: "", phone: "", school_class_id: "" });
    load();
  }
  async function remove(id) {
    if (!confirm("Hapus siswa?")) return;
    await api.delete(`/students/${id}`);
    load();
  }

  return (
    <div className="container mt-4">
      <h3>Students</h3>
      <form className="mb-3" onSubmit={submit}>
        <div className="row g-2">
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="NIS"
              value={form.nis}
              onChange={(e) => setForm({ ...form, nis: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Phone"
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
          <button className="btn btn-primary">Add Student</button>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>NIS</th>
            <th>Name</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.nis}</td>
              <td>{s.name}</td>
              <td>{s.class ? s.class.name : "-"}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
