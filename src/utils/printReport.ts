export const printReport = (elementId: string) => {
  const el = document.getElementById(elementId);
  if (!el) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>NEU Library Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #000;
            background: #fff;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th {
            background: #f0f0f0;
            border: 1px solid #ccc;
            padding: 8px 10px;
            text-align: left;
            font-weight: 600;
          }
          td {
            border: 1px solid #ddd;
            padding: 7px 10px;
          }
          tr:nth-child(even) { background: #fafafa; }
          h2 { margin-bottom: 16px; font-size: 16px; }
          img { max-width: 100%; height: auto; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h2>NEU Library — Report</h2>
        ${el.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

