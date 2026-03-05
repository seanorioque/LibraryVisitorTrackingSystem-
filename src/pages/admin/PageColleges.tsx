import {
  Btn,
  Card,
  Modal,
  PIE_COLORS,
  collegeData,
  Input,
  fmt,
} from "./Admin";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Colleges from "../../utils/College";
import T from "../../utils/theme.ts";
import CollegeEntry from "../../types/CollegeEntry.ts";
const PageColleges = () => {
  const [colleges, setColleges] = useState<CollegeEntry[]>(
    Colleges.map((c, i) => ({
      id: i + 1,
      name: c,
      departments: (
        [
          [
            "Electrical Engineering",
            "Civil Engineering",
            "Mechanical Engineering",
            "Electronics Engineering",
          ],
          ["Accountancy", "Business Management", "Marketing", "Finance"],
          ["Elementary Education", "Secondary Education", "Special Education"],
          [
            "Information Technology",
            "Computer Science",
            "Data Science",
            "Cybersecurity",
          ],
          ["Psychology", "Political Science", "English", "Biology"],
          ["Nursing", "Midwifery"],
          ["Architecture", "Interior Design"],
          ["Criminology"],
        ] as string[][]
      )[i],
      color: PIE_COLORS[i],
      visitors: collegeData[i].visitors,
      active: true,
    })),
  );

  const [addDeptModal, setAddDeptModal] = useState<number | null>(null);
  const [newDept, setNewDept] = useState("");

  const addDept = (cid: number) => {
    if (!newDept) return;
    setColleges((prev) =>
      prev.map((c) =>
        c.id === cid ? { ...c, departments: [...c.departments, newDept] } : c,
      ),
    );
    setNewDept("");
    setAddDeptModal(null);
  };

  const removeDept = (cid: number, dept: string) => {
    setColleges((prev) =>
      prev.map((c) =>
        c.id === cid
          ? { ...c, departments: c.departments.filter((d) => d !== dept) }
          : c,
      ),
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 14,
      }}
    >
      {colleges.map((col) => (
        <Card key={col.id} style={{ borderLeft: `3px solid ${col.color}` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  color: T.textHi,
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 2,
                }}
              >
                {col.name}
              </div>
              <div style={{ color: T.textLo, fontSize: 11 }}>
                {col.departments.length} departments · {fmt(col.visitors)}{" "}
                visitors
              </div>
            </div>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: col.color,
                marginTop: 4,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              marginBottom: 12,
            }}
          >
            {col.departments.map((d) => (
              <div
                key={d}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: col.color + "15",
                  border: `1px solid ${col.color}33`,
                  borderRadius: 12,
                  padding: "3px 8px",
                  fontSize: 11,
                }}
              >
                <span style={{ color: T.text }}>{d}</span>
                <button
                  onClick={() => removeDept(col.id, d)}
                  style={{
                    background: "none",
                    border: "none",
                    color: T.textLo,
                    cursor: "pointer",
                    fontSize: 10,
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Btn
            variant="ghost"
            style={{ width: "100%", justifyContent: "center", fontSize: 11 }}
            onClick={() => setAddDeptModal(col.id)}
          >
            + Add Department
          </Btn>
        </Card>
      ))}

      <AnimatePresence>
        {addDeptModal !== null && (
          <Modal
            title="➕ Add Department"
            onClose={() => setAddDeptModal(null)}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input
                placeholder="Department name..."
                value={newDept}
                onChange={setNewDept}
                style={{ width: "100%" }}
              />
              <div
                style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
              >
                <Btn variant="ghost" onClick={() => setAddDeptModal(null)}>
                  Cancel
                </Btn>
                <Btn onClick={() => addDept(addDeptModal)} disabled={!newDept}>
                  Add
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
