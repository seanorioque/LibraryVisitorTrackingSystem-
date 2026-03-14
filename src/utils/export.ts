type ExportType = "users" | "logs" | "default";

const USER_COLUMNS: { key: string; label: string }[] = [
  { key: "name",      label: "Full Name" },
  { key: "email",     label: "Email" },
  { key: "college",   label: "College" },
  { key: "studentId", label: "Student ID" },
  { key: "status",    label: "Status" },
  { key: "role",      label: "Role" },
];

const LOG_COLUMNS: { key: string; label: string }[] = [
  { key: "name",      label: "Full Name" },
  { key: "email",     label: "Email" },
  { key: "college",   label: "College" },
  { key: "studentId", label: "Student ID" },
  { key: "reason",    label: "Reason for Visit" },
  { key: "date",      label: "Date" },
  { key: "time",      label: "Time" },
];

export const exportToExcel = (
  data: Record<string, unknown>[],
  filename: string,
  type: ExportType = "default",
) => {
  if (!data || data.length === 0) return;

  let columns: { key: string; label: string }[];

  if (type === "users") {
    columns = USER_COLUMNS;
  } else if (type === "logs") {
    columns = LOG_COLUMNS;
  } else {
    // fallback: use raw keys
    columns = Object.keys(data[0]).map((k) => ({ key: k, label: k }));
  }

  const escape = (val: unknown) =>
    `"${String(val ?? "—").replace(/"/g, '""')}"`;

  const headers = columns.map((c) => escape(c.label)).join(",");
  const rows = data
    .map((r) => columns.map((c) => escape(r[c.key])).join(","))
    .join("\n");

  const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  a.click();
  URL.revokeObjectURL(url);
};