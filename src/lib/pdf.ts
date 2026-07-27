import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SheetData } from "@/types";

export const exportToPDF = async (data: SheetData) => {
  const input = document.getElementById("calculator-container");
  if (!input) return;

  // We can temporarily hide things or add a specific print class here if needed
  // For now, we rely on the .no-print classes or we can just capture the element
  
  try {
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    });
    
    const imgData = canvas.toDataURL("image/png");
    
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(imgData);
    const imgRatio = imgProps.width / imgProps.height;
    
    // Scale image to fit within the width
    let finalWidth = pdfWidth - 20; // 10mm margin on each side
    let finalHeight = finalWidth / imgRatio;
    
    // If it's too tall, scale by height instead
    if (finalHeight > pdfHeight - 20) {
      finalHeight = pdfHeight - 20;
      finalWidth = finalHeight * imgRatio;
    }
    
    pdf.addImage(imgData, "PNG", 10, 10, finalWidth, finalHeight);
    
    pdf.save(`Race_${data.raceName || "Sheet"}_${data.date}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
