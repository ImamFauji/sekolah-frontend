import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    load();
  }, []);
  async function load() {
    const res = await api.get("/dashboard/list-all");
    setClasses(res.data);
  }
  return (
    <div className="container mt-4">
      <h3>Dashboard</h3>
      {classes.map((c) => (
        <div className="card mb-2" key={c.id}>
          <div className="card-body">
            <h5>
              {c.name} <small className="text-muted">{c.code}</small>
            </h5>
            <p>{c.description}</p>
            <p>
              <strong>Siswa:</strong> {c.students.length} —{" "}
              <strong>Guru:</strong> {c.teachers.length}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
