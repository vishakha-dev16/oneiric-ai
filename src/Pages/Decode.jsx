import React, { useState } from "react";
import "../Components/Decode.css";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const Decode = () => {
  const [dream, setDream] = useState("");
  const [response, setResponse] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGuestPopup, setShowGuestPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isGuest = new URLSearchParams(location.search).get("guest") === "true";
  const API_KEY = process.env.REACT_APP_POLLINATIONS_API_KEY;

  // ✅ helper FIRST (important)
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
    });
  };

  const formatResponse = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // bold
    .replace(/- /g, "<br/>• ")             // bullets
    .replace(/\n/g, "<br/>");              // line breaks
};

  const handleSend = async () => {
    if (!dream.trim()) return;

    setLoading(true);
    setResponse("🧠 Interpreting your dream...");
    setImageUrl("");

    try {
      // ✅ TEXT AI
      const textRes = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai",
          messages: [
            {
              role: "user",
              content: `Interpret this dream gently and psychologically in simple words: ${dream}`
            }
          ]
        })
      });

      const textData = await textRes.json();
      const interpretedText = textData.choices?.[0]?.message?.content || "";

      if (!interpretedText || interpretedText.length < 20) {
        throw new Error("Invalid AI response");
      }

      setResponse(interpretedText);

      // ✅ IMAGE AI
      const imageRes = await fetch(
        `https://gen.pollinations.ai/image/${encodeURIComponent(dream)}?model=flux`,
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`
          }
        }
      );

      const blob = await imageRes.blob();

      if (!blob || blob.size === 0) {
        throw new Error("Image generation failed");
      }

      const base64Image = await convertBlobToBase64(blob);
      setImageUrl(base64Image);

      // ✅ SAVE ONLY IF LOGGED USER
      if (!isGuest && auth.currentUser) {

        // Local history
        const old = JSON.parse(localStorage.getItem("dreamHistory")) || [];

        old.push({
          dream,
          response: interpretedText,
          image: base64Image,
          date: new Date().toISOString()
        });

        localStorage.setItem("dreamHistory", JSON.stringify(old));

        // Firebase lifetime storage
        await addDoc(collection(db, "dreams"), {
          uid: auth.currentUser.uid,
          dreamText: dream,
          interpretation: interpretedText,
          imageBase64: base64Image,
          createdAt: serverTimestamp()
        });
      }

    } catch (error) {
      console.error(error);
      setResponse("⚠️ AI service error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <h2>Oneiric AI</h2>
        </div>

        <div className="nav-links">
          <a href="/">Home</a>

          <button
            className="btn-nav"
            onClick={() => {
              if (isGuest) {
                setShowGuestPopup(true);
              } else {
                navigate("/dashboard");
              }
            }}
          >
            Dashboard
          </button>

          <button
            className="btn-nav"
            onClick={() => {
              if (isGuest) {
                navigate("/");
              } else {
                navigate("/login");
              }
            }}
          >
            {isGuest ? "Exit Guest" : "Logout"}
          </button>
        </div>
      </div>

      {/* GUEST POPUP */}
      {showGuestPopup && (
        <div className="guest-popup-overlay">
          <div className="guest-popup">
            <h2>🌙 Guest Mode</h2>
            <p>
              You’re exploring as a guest.<br />
              Create a free account to unlock your dashboard, dream history, and profile.
            </p>

            <div className="popup-actions">
              <button className="btn-primary" onClick={() => navigate("/signup")}>
                Create Account
              </button>

              <button className="btn-secondary" onClick={() => setShowGuestPopup(false)}>
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="decode-container">
        <h2>Decode Your Dream</h2>

        <textarea
          placeholder="Describe your dream here..."
          value={dream}
          onChange={(e) => setDream(e.target.value)}
        ></textarea>

        <button className="send-btn" onClick={handleSend} disabled={loading}>
          {loading ? "Decoding..." : "Send"}
        </button>

        {response && (
          <div className="ai-response">
            <p dangerouslySetInnerHTML={{ __html: formatResponse(response) }}></p>
          </div>
        )}

        {imageUrl && (
          <div className="dream-image" style={{ textAlign: "center", marginTop: "20px" }}>
            <h3>🌙 Dream Visualization</h3>
            <img
              src={imageUrl}
              alt="Dream visualization"
              style={{
                width: "100%",
                maxWidth: "420px",
                borderRadius: "12px",
                marginTop: "10px",
              }}
            />
          </div>
        )}

        {isGuest && (
          <p className="guest-msg">
            🌙 Wanna save your dreams and track them forever? <br />
            <span onClick={() => navigate("/signup")}>Create an account ✨</span>
          </p>
        )}
      </div>
    </>
  );
};

export default Decode;
