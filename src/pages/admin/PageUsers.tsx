import { USERS,  Btn, Card, TD,Select, Input, exportToExcel,Table,Badge,BlockModal} from "./Admin";
import { useState, } from "react";
import { AnimatePresence } from "framer-motion";
import Colleges from  "../../utils/College.ts";
import T from "../../utils/theme.ts"
import User from "../../types/User.ts" 

const PageUsers = () => {
  const [users, setUsers] = useState<User[]>(USERS);
  const [search, setSearch] = useState("");
  const [filterCollege, setFilterCollege] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirmModal, setConfirmModal] = useState<{
    user: User;
    action: string;
  } | null>(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchCollege = filterCollege === "all" || u.college === filterCollege;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchCollege && matchStatus;
  });

  const toggle = (id: number, action: "block" | "unblock", reason?: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: action === "block" ? "blocked" : "active",
              blockReason: action === "block" ? (reason ?? null) : null,
            }
          : u,
      ),
    );
    setConfirmModal(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="🔍 Search by name or email..."
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
          {filtered.length} users
        </span>
      </div>

      <Card style={{ padding: 0 }}>
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
                <span style={{ fontSize: 11 }}>{u.college}</span>
              </TD>
              <TD style={{ color: T.accent }}>{u.visits}</TD>
              <TD style={{ fontSize: 11 }}>{u.lastVisit}</TD>
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
                    🚫 Block
                  </Btn>
                ) : (
                  <Btn
                    variant="success"
                    onClick={() => toggle(u.id, "unblock")}
                  >
                    ✅ Unblock
                  </Btn>
                )}
              </TD>
            </>
          )}
        />
      </Card>

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