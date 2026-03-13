import { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import T from "../../utils/theme";
import VISIT_REASONS from "../../types/ReasonsForVisit";

const Students = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const user = auth.currentUser;

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError("Please select a reason for your visit.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!user) throw new Error("No authenticated user found.");

      // Record the visit log in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const college = userDoc.exists() ? userDoc.data().college : "Unknown";

      await addDoc(collection(db, "visits"), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        reason: selectedReason,
        college, 
        timestamp: new Date(),
      });
      navigate("/success"); // ← redirect to success page after logging
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: "40px 48px",
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              color: T.textHi,
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Welcome back
            {user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
          </h1>
          <p style={{ color: T.textLo, fontSize: 13 }}>
            Please select your reason for visiting the library today.
          </p>
        </div>

        {/* Reason Selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label
            style={{
              color: T.textLo,
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Reason for Visit
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {VISIT_REASONS.map((reason) => (
              <motion.button
                key={reason.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedReason(reason.value)}
                style={{
                  background:
                    selectedReason === reason.value
                      ? T.accent + "22"
                      : T.elevated,
                  border: `1px solid ${
                    selectedReason === reason.value ? T.accent : T.border
                  }`,
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: selectedReason === reason.value ? T.accent : T.textHi,
                  fontSize: 13,
                  fontWeight: selectedReason === reason.value ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                }}
              >
                {reason.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: T.red + "18",
              border: `1px solid ${T.red + "44"}`,
              borderRadius: 8,
              padding: "10px 14px",
              color: T.red,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: T.accent,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 0",
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: `2px solid #ffffff44`,
                  borderTopColor: "#fff",
                  display: "inline-block",
                }}
              />
              Logging visit...
            </>
          ) : (
            "Log Visit"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Students;
