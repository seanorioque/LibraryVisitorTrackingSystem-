import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, collection, onSnapshot,  } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import T from "../../utils/theme";

const RegisterStudent = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [colleges, setColleges] = useState<string[]>([]); // ← from Firestore

  // ✅ Fetch colleges from Firestore in real time
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "colleges"),
      (snap) => {
        const names = snap.docs
          .map((d) => d.data().name as string)
          .filter(Boolean)
          .sort();
        setColleges(names);
      }
    );
    return () => unsub();
  }, [db]);

  const formatStudentId = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 7)}-${digits.slice(7, 10)}`;
  };

  const handleSubmit = async () => {
    if (!selectedCollege) {
      setError("Please select your college.");
      return;
    }
    if (!studentId.trim() || studentId.length < 12) {
      setError("Please enter a valid student ID (e.g. 23-12883-625).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found.");

      await updateDoc(doc(db, "users", user.uid), {
        college: selectedCollege,
        studentId: studentId.trim(),
      });

      navigate("/Students");
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
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: T.textHi, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Welcome to NEU Library
          </h1>
          <p style={{ color: T.textLo, fontSize: 13 }}>
            Please complete your registration to continue.
          </p>
        </div>

        {/* ── Student ID ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ color: T.textLo, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Student ID Number
          </label>
          <input
            type="text"
            placeholder="e.g. 23-12883-625"
            value={studentId}
            onChange={(e) => setStudentId(formatStudentId(e.target.value))}
            maxLength={12}
            style={{
              background: T.elevated,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              color: T.textHi,
              fontSize: 13,
              padding: "10px 14px",
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        {/* ── College ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ color: T.textLo, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            College
          </label>
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            style={{
              background: T.elevated,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              color: selectedCollege ? T.textHi : T.textLo,
              fontSize: 13,
              padding: "10px 14px",
              outline: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <option value="" disabled>
              {colleges.length === 0 ? "Loading colleges..." : "Select your college..."}
            </option>
            {colleges.map((college) => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
        </div>

        {/* ── Error ── */}
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

        {/* ── Submit ── */}
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
              Saving...
            </>
          ) : (
            "Complete Registration"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RegisterStudent;