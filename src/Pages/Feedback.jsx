import React, { useState } from "react";
import "../Components/Feedback.css";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const Feedback = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message || rating === 0) {
      alert("Please fill all fields and give a rating 🌙");
      return;
    }

    try {
      await addDoc(collection(db, "feedbacks"), {
        name,
        email,
        message,
        rating,
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setRating(0);
    } catch (error) {
      console.error("Feedback error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <h2>Oneiric AI</h2>
        </div>

        <div className="nav-links">
          <button className="btn-nav" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="feedback-container">
        <h2>💬 Share Your Feedback</h2>
        <p className="feedback-sub">
          Your thoughts help us improve Oneiric AI 🌙
        </p>

        {submitted && (
          <div className="success-msg">
            ✨ Thank you! Your feedback has been sent.
          </div>
        )}

        <form className="feedback-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          {/* ⭐ RATING */}
          <div className="rating-box">
            <p>Rate your experience:</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={num <= rating ? "star active" : "star"}
                  onClick={() => setRating(num)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="send-btn">
            Send Feedback
          </button>
        </form>
      </div>
    </>
  );
};

export default Feedback;
