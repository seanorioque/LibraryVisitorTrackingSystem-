import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import Colleges from "../../utils/College.ts";
import T from "../../utils/theme.ts";
import Badge from "../../components/Badge.tsx";
import { exportToExcel } from "../../utils/export.ts";
import Input from "../../components/Input.tsx";
import BlockModal from "../../components/BlockModal.tsx";
import TD from "../../components/TD.tsx";
import Table from "../../components/Table.tsx";
import Card from "../../components/Card.tsx";
import Btn from "../../components/Btn.tsx";
import Select from "../../components/Select.tsx";
import User from "../../types/User.ts";

// ── Component ──────────────────────────────────────────────
const PageUsers = () => {
  const db = getFirestore();

  const [users, setUsers] = useState<User[]>([]);
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});
  const [lastVisits, setLastVisits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCollege, setFilterCollege] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirmModal, setConfirmModal] = useState<{
    user: User;
    action: string;
  } | null>(null);

  // ── Realtime: users collection ──
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<User, "id">),
          status: d.data().status ?? "active",
          blockReason: d.data().blockReason ?? null,
        }));
        setUsers(data);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [db]);

  // ── Realtime: visits collection → derive visit counts + last visit ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "visits"), (snap) => {
      const counts: Record<string, number> = {};
      const latest: Record<string, number> = {}; // uid → latest timestamp ms

      snap.docs.forEach((d) => {
        const v = d.data();
        const uid = v.uid as string;
        if (!uid) return;

        // Count
        counts[uid] = (counts[uid] ?? 0) + 1;

        // Latest timestamp
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
          ]),
        ),
      );
    });
    return () => unsub();
  }, [db]);

  // ── Block / Unblock ──
  const toggle = async (
    id: string,
    action: "block" | "unblock",
    reason?: string,
  ) => {
    const ref = doc(db, "users", id);
    await updateDoc(ref, {
      status: action === "block" ? "blocked" : "active",
      blockReason: action === "block" ? (reason ?? null) : null,
    });
    setConfirmModal(null);
  };

  // ── Filter ──
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    const matchCollege = filterCollege === "all" || u.college === filterCollege;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchCollege && matchStatus;
  });

  // ── Render ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Filters ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={setSearch}
          style={{ flex: 1, minWidth: 200 }}
        />
        <Select
          value={filterCollege}
          onChange={setFilterCollege}
          options={[
            { value: "all", label: "All Colleges" },
            ...Colleges.map((c) => ({ value: c, label: c })),
          ]}
          style={{ minWidth: 180 }}
        />
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "blocked", label: "Blocked" },
          ]}
          style={{ minWidth: 130 }}
        />
        <Btn
          variant="ghost"
          onClick={() =>
            exportToExcel(
              filtered as unknown as Record<string, unknown>[],
              "users-export",
            )
          }
        >
          ⬇ Export
        </Btn>
        <span style={{ color: T.textLo, fontSize: 12 }}>
          {loading ? "Loading..." : `${filtered.length} users`}
        </span>
      </div>

      {/* ── Table ── */}
      <Card style={{ padding: 0 }}>
        {loading ? (
          <div
            style={{
              color: T.textLo,
              fontSize: 13,
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              color: T.textLo,
              fontSize: 13,
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            No users found.
          </div>
        ) : (
          <Table
            columns={[
              "Name",
              "Email (Institutional)",
              "College",
              "Visits",
              "Last Visit",
              "Status",
              "Actions",
            ]}
            data={filtered}
            renderRow={(u: User) => (
              <>
                <TD style={{ color: T.textHi, fontWeight: 500 }}>{u.name}</TD>
                <TD>{u.email}</TD>
                <TD style={{ maxWidth: 140 }}>
                  <span style={{ fontSize: 11 }}>{u.college ?? "—"}</span>
                </TD>
                <TD style={{ color: T.accent }}>{visitCounts[u.uid] ?? 0}</TD>
                <TD style={{ fontSize: 11 }}>
                  {lastVisits[u.uid] ?? "No visits yet"}
                </TD>
                <TD>
                  <Badge status={u.status} />
                </TD>
                <TD>
                  {u.status === "active" ? (
                    <Btn
                      variant="danger"
                      onClick={() =>
                        setConfirmModal({ user: u, action: "block" })
                      }
                    >
                      Block
                    </Btn>
                  ) : (
                    <Btn
                      variant="success"
                      onClick={() => toggle(u.id, "unblock")}
                    >
                      Unblock
                    </Btn>
                  )}
                </TD>
              </>
            )}
          />
        )}
      </Card>

      {/* ── Block Modal ── */}
      <AnimatePresence>
        {confirmModal && (
          <BlockModal
            user={confirmModal.user}
            onConfirm={(r: string) => toggle(confirmModal.user.id, "block", r)}
            onClose={() => setConfirmModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageUsers;
