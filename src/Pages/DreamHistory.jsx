import React, { useEffect, useState } from "react";
import "../Components/DreamHistory.css";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase";



const DreamHistory = () => {
  const [dreams, setDreams] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchDreams = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "dreams"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const userDreams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setDreams(userDreams);
  };

  fetchDreams();
}, []);



  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <h2>Oneiric AI</h2>
        </div>

        <div className="nav-links">
          <button className="btn-nav" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className="btn-nav" onClick={() => navigate("/decode")}>
            Decode Dream
          </button>
          <button className="btn-nav" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="history-container">
        <h2>🌙 Dream History</h2>

        {dreams.length === 0 ? (
          <p className="empty-msg">No dreams saved yet. Decode your first dream ✨</p>
        ) : (
          <div className="dream-list">
            {dreams.map((item, index) => (
              <div className="dream-card" key={index}>
                <h4>Dream #{dreams.length - index}</h4>
               <p className="dream-text">
  <b>Dream:</b> {item.dreamText}
</p>

<p className="dream-response">
  <b>Meaning:</b> {item.interpretation}
</p>

{item.imageBase64 && (
  <img src={item.imageBase64} alt="dream" />
)}

              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DreamHistory;
