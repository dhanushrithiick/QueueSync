import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import "../stylesheets/Register.css";

export default function Register() {
  const navigate = useNavigate(); // ✅ for redirect
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queueId, setQueueId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateNextId = async () => {
    const q = query(collection(db, "Queue"), orderBy("createdAt", "desc"), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return "Q01";
    const lastDoc = snapshot.docs[0];
    const lastId = lastDoc.id;
    const lastNum = parseInt(lastId.replace("Q", ""), 10);
    const nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
    return "Q" + nextNum.toString().padStart(2, "0");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.number && formData.email) {
      setLoading(true);
      try {
        const nextId = await generateNextId();
        await setDoc(doc(db, "Queue", nextId), {
          Name: formData.name,
          Phone: formData.number,
          Email: formData.email,
          createdAt: new Date(),
        });

        setQueueId(nextId);
        setSubmitted(true);
        console.log(`✅ Registered under ID: ${nextId}`);

        // Redirect after short delay
        setTimeout(() => {
          navigate("/");
        }, 2500);
      } catch (error) {
        console.error("❌ Error saving document:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-page">
      {/* 🔹 Back Button */}
      <div className="back-button-container">
        <Link to="/" className="back-btn">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="register-title">Join the Queue</h1>
      <p className="register-subtitle">Enter your details below</p>

      <div className="register-card">
        {!submitted ? (
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="number">Phone Number</label>
              <input
                type="tel"
                id="number"
                name="number"
                placeholder="Enter your phone number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Register"}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <h2>✅ Registration Successful!</h2>
            <p>
              You’ve been added as <span className="info-highlight">{queueId}</span>
            </p>
            <p>Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
