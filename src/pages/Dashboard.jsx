import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Hello from '../components/navbar';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../stylesheets/Dashboard.css";

export default function Dashboard() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "Queue"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        sno: index + 1,
        name: doc.data().Name,
        phone: doc.data().Phone,
        email: doc.data().Email,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setQueue(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const total = queue.length;
  const nowServing = queue[0];
  const next = queue[1];
  const lastAdded = queue[queue.length - 1];

  const chartData = queue.map((p, i) => ({
    time: p.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    count: i + 1,
  }));

  return (<>
  <Hello/>
      <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Queue Management Dashboard</h1>
        <p>Monitor real-time queue flow and activity</p>
      </header>

      {/* ---- STAT CARDS ---- */}
      <div className="stats-row">
        <div className="stat glass">
          <h3>Total Members</h3>
          <p>{total}</p>
        </div>
        <div className="stat glass">
          <h3>Now Serving</h3>
          <p>{nowServing ? `${nowServing.id}` : "--"}</p>
        </div>
        <div className="stat glass">
          <h3>Next in Queue</h3>
          <p>{next ? `${next.id}` : "--"}</p>
        </div>
        <div className="stat glass">
          <h3>Last Added</h3>
          <p>{lastAdded ? `${lastAdded.id}` : "--"}</p>
        </div>
      </div>

      {/* ---- QUEUE TABLE ---- */}
      <div className="main-card glass">
        <h2>Queue Members</h2>
        {loading ? (
          <p className="loading">Loading queue...</p>
        ) : total === 0 ? (
          <p className="loading">No members found.</p>
        ) : (
          <table className="queue-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Queue ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((person, index) => (
                <tr
                  key={person.id}
                  className={
                    index === 0
                      ? "status-now"
                      : index === 1
                      ? "status-next"
                      : ""
                  }
                >
                  <td>{person.sno}</td>
                  <td>{person.id}</td>
                  <td>{person.name}</td>
                  <td>{person.phone}</td>
                  <td>{person.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---- BOTTOM GRID ---- */}
      <div className="bottom-section">
        <div className="bottom-card glass">
          <h2>Recent Registrations</h2>
          <ul>
            {queue.slice(-5).reverse().map((p) => (
              <li key={p.id}>
                <span className="q-id">{p.id}</span> {p.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="bottom-card glass">
          <h2>Queue Growth Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
              <XAxis dataKey="time" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#00b7ff"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </>

  );
}
