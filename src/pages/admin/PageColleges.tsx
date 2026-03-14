import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import T from "../../utils/theme.ts";
import { PIE_COLORS } from "../../constants/charts.ts";
import { fmt } from "../../utils/format.ts";
import Input from "../../components/Input.tsx";
import Modal from "../../components/Modal.tsx";
import Card from "../../components/Card.tsx";
import Btn from "../../components/Btn.tsx";
import CollegeRecord from "../../types/CollegeRecord.ts";

const PageColleges = () => {
  const db = getFirestore();
  const [colleges, setColleges] = useState<CollegeRecord[]>([]);
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});

  // ── Add College Modal ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // ── Delete Confirmation Modal ──
  const [deleteTarget, setDeleteTarget] = useState<CollegeRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Realtime: colleges collection ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "colleges"), (snap) => {
      setColleges(
        snap.docs.map((d, i) => ({
          id: d.id,
          name: d.data().name ?? d.id,
          color: d.data().color ?? PIE_COLORS[i % PIE_COLORS.length],
          visitors: 0,
        })),
      );
    });
    return () => unsub();
  }, [db]);

  // ── Realtime: visitor counts from visits ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "visits"), (snap) => {
      const countMap: Record<string, number> = {};
      snap.docs.forEach((d) => {
        const college = d.data().college as string;
        if (college) countMap[college] = (countMap[college] ?? 0) + 1;
      });
      setVisitCounts(countMap);
    });
    return () => unsub();
  }, [db]);

  // ── Add College ──
  const addCollege = async () => {
    if (!newCollegeName.trim()) {
      setAddError("Please enter a college name.");
      return;
    }
    const isDuplicate = colleges.some(
      (c) => c.name.toLowerCase() === newCollegeName.trim().toLowerCase(),
    );
    if (isDuplicate) {
      setAddError("This college already exists.");
      return;
    }

    setAddLoading(true);
    setAddError("");
    try {
      const id = newCollegeName.trim().replace(/\s+/g, "_").toLowerCase();
      await setDoc(doc(db, "colleges", id), {
        name: newCollegeName.trim(),
        color: PIE_COLORS[colleges.length % PIE_COLORS.length],
      });
      setNewCollegeName("");
      setShowAddModal(false);
    } catch (err) {
      setAddError("Failed to add college. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  // ── Delete College ──
  const deleteCollege = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "colleges", deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete college:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn
          onClick={() => {
            setShowAddModal(true);
            setAddError("");
          }}
        >
          + Add College
        </Btn>
      </div>

      {/* ── College Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 14,
        }}
      >
        {colleges.length === 0 ? (
          <div
            style={{
              color: T.textLo,
              fontSize: 13,
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            No colleges yet. Add one above.
          </div>
        ) : (
          colleges.map((col) => (
            <motion.div
              key={col.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card style={{ borderLeft: `3px solid ${col.color}` }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: T.textHi,
                        fontWeight: 700,
                        fontSize: 14,
                        marginBottom: 4,
                      }}
                    >
                      {col.name}
                    </div>
                    <div style={{ color: T.textLo, fontSize: 11 }}>
                      {fmt(visitCounts[col.name] ?? 0)} visitors
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: col.color,
                      }}
                    />
                    <Btn
                      variant="danger"
                      onClick={() => setDeleteTarget(col)}
                      style={{ fontSize: 11, padding: "4px 10px" }}
                    >
                      Delete
                    </Btn>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* ── Add College Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <Modal title="Add College" onClose={() => setShowAddModal(false)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input
                placeholder="College name..."
                value={newCollegeName}
                onChange={(v) => {
                  setNewCollegeName(v);
                  setAddError("");
                }}
                style={{ width: "100%" }}
              />
              {addError && (
                <div
                  style={{
                    background: T.red + "18",
                    border: `1px solid ${T.red}44`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    color: T.red,
                    fontSize: 12,
                  }}
                >
                  {addError}
                </div>
              )}
              <div
                style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
              >
                <Btn variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Btn>
                <Btn
                  onClick={addCollege}
                  disabled={addLoading || !newCollegeName.trim()}
                >
                  {addLoading ? "Adding..." : "Add College"}
                </Btn>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteTarget && (
          <Modal title="Delete College?" onClose={() => setDeleteTarget(null)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ color: T.text, fontSize: 13 }}>
                Are you sure you want to delete{" "}
                <span style={{ color: T.red, fontWeight: 600 }}>
                  {deleteTarget.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div
                style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
              >
                <Btn variant="ghost" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </Btn>
                <Btn
                  variant="danger"
                  onClick={deleteCollege}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Btn>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageColleges;
