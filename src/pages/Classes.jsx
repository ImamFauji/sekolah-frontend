import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    load();
  }, []);
  async function load() {
    const res = await api.get("/classes");
    setClasses(res.data);
  }
  async function submit(e) {
    e.preventDefault();
    await api.post("/classes", { name, code, description });
    setName("");
    setCode("");
    setDescription("");
    load();
  }
  async function remove(id) {
    if (!confirm("Hapus kelas?")) return;
    await api.delete(`/classes/${id}`);
    load();
  }

  return (
    <div className="container mt-4">
      <h3>Classes</h3>
      <form className="mb-3" onSubmit={submit}>
        <div className="row">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary">Add</button>
          </div>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Code</th>
            <th>Students</th>
            <th>Teachers</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.code}</td>
              <td>{c.students.length}</td>
              <td>{c.teachers.length}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(c.id)}
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
