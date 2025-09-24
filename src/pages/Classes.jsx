import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch (err) {
      console.error("Error load classes:", err.response?.data || err.message);
    }
  }

  async function submit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/classes/${editingId}`, { name, code, description });
        setEditingId(null);
      } else {
        await api.post("/classes", { name, code, description });
      }
      setName("");
      setCode("");
      setDescription("");
      load();
    } catch (err) {
      console.error("Error submit:", err.response?.data || err.message);
    }
  }

  async function remove(id) {
    if (!confirm("Hapus kelas?")) return;
    try {
      await api.delete(`/classes/${id}`);
      load();
    } catch (err) {
      console.error("Error delete:", err.response?.data || err.message);
    }
  }

  function handleEdit(c) {
    setEditingId(c.id);
    setName(c.name);
    setCode(c.code);
    setDescription(c.description);
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setCode("");
    setDescription("");
  }

  return (
    <div className="container mt-4">
      <h3>Management Kelas</h3>
      <form className="mb-3" onSubmit={submit}>
        <div className="row">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Kode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-primary">
              {editingId ? "Update" : "Tambah"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Batal
              </button>
            )}
          </div>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Kode</th>
            <th>Siswa</th>
            <th>Guru</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.code}</td>
              <td>{c.students ? c.students.length : 0}</td>
              <td>{c.teachers ? c.teachers.length : 0}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(c)}
                >
                  Ubah
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(c.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
