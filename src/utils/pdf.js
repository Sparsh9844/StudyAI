import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToPDF(title, columns, rows, filename) {
  const doc = new jsPDF();

  doc.setTextColor(99, 102, 241);
  doc.setFontSize(18);
  doc.text(title, 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [columns],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 255],
    },
  });

  doc.save(`${filename}.pdf`);
}
