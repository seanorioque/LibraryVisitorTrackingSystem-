export const exportToExcel = (
  data: Record<string, unknown>[],
  filename: string,
) => {
  const headers = Object.keys(data[0]).join(",");
  const rows = data
    .map((r) =>
      Object.values(r)
        .map((v) => `"${v}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  a.click();
};