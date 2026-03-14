import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import T from "../../utils/theme.ts";
import User from "../../types/User.ts";
import Badge from "../../components/Badge.tsx";
import Modal from "../../components/Modal.tsx";
import Card from "../../components/Card.tsx";
import Btn from "../../components/Btn.tsx";

const PageBlocked = () => {
  const db = getFirestore();
  const [users, setUsers] = useState<User[]>([]);
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});
  const [lastVisits, setLastVisits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);

  // Realtime: only blocked users 
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "users"), where("status", "==", "blocked")),
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<User, "id">),
        }));
        setUsers(data);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [db]);

  // ── Realtime: derive visit counts + last visit from visits collection ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "visits"), (snap) => {
      const counts: Record<string, number> = {};
      const latest: Record<string, number> = {};

      snap.docs.forEach((d) => {
        const v = d.data();
        const uid = v.uid as string;
        if (!uid) return;

        counts[uid] = (counts[uid] ?? 0) + 1;

        const ts = v.timestamp?.seconds
          ? v.timestamp.seconds * 1000
          : new Date(v.timestamp).getTime();
        if (!latest[uid] || ts > latest[uid]) latest[uid] = ts;
      });

      setVisitCounts(counts);
      setLastVisits(
        Object.fromEntries(
          Object.entries(latest).map(([uid, ms]) => [
            uid,
            new Date(ms).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          ])
        )
      );
    });
    return () => unsub();
  }, [db]);

  // Unblock 
  const unblock = async (id: string) => {
    await updateDoc(doc(db, "users", id), {
      status: "active",
      blockReason: null,
    });
    setSelected(null);
  };

  if (loading) return (
    <div style={{ color: T.textLo, fontSize: 13, textAlign: "center", padding: "40px 0" }}>
      Loading...
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {users.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>No blocked users.</div>
          <div style={{ color: T.textLo, fontSize: 13, marginTop: 4 }}>
            All users currently have active access.
          </div>
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {users.map((u) => (
            <motion.div
              key={u.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: T.surface,
                border: `1px solid ${T.red}44`,
                borderRadius: 12,
                padding: 18,
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onClick={() => setSelected(u)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = T.red + "99")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = T.red + "44")
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <div>
                  <div style={{ color: T.textHi, fontWeight: 600, fontSize: 14 }}>
                    {u.name}
                  </div>
                  <div style={{ color: T.textLo, fontSize: 11, marginTop: 2 }}>
                    {u.email}
                  </div>
                </div>
                <Badge status="blocked" />
              </div>
              <div style={{ color: T.textLo, fontSize: 11, marginBottom: 8 }}>
                {u.college}
              </div>
              <div
                style={{
                  background: T.red + "11",
                  border: `1px solid ${T.red}22`,
                  borderRadius: 6,
                  padding: "6px 10px",
                  fontSize: 12,
                }}
              >
                <span style={{ color: T.red, fontWeight: 600 }}>Reason: </span>
                <span style={{ color: T.textLo }}>{u.blockReason}</span>
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Btn
                  variant="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    unblock(u.id);
                  }}
                >
                  Unblock
                </Btn>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <Modal title="Blocked User Details" onClose={() => setSelected(null)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              {(
                [
                  ["Name", selected.name],
                  ["Email", selected.email],
                  ["College", selected.college ?? "—"],
                  ["Last Visit", lastVisits[selected.uid] ?? "No visits yet"],
                  ["Total Visits", String(visitCounts[selected.uid] ?? 0)],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: T.textLo }}>{k}</span>
                  <span style={{ color: T.textHi, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div
                style={{
                  background: T.red + "11",
                  border: `1px solid ${T.red}33`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  marginTop: 4,
                }}
              >
                <div style={{ color: T.red, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                  BLOCK REASON
                </div>
                <div style={{ color: T.textLo }}>{selected.blockReason}</div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <Btn variant="ghost" onClick={() => setSelected(null)}>Close</Btn>
                <Btn variant="success" onClick={() => unblock(selected.id)}>
                  Unblock User
                </Btn>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageBlocked;