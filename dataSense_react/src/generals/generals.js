import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../assets/images/jarvis_logo_1.png";

export const generateCSV = (apiData, baseFilename, columnOrder = null) => {
  // Check if apiData is an array and has at least one item
  if (!Array.isArray(apiData) || apiData.length === 0) {
    console.error("Invalid API data. It should be a non-empty array.");
    return;
  }

  // Function to escape values properly
  const escapeValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }
    // Convert value to string and escape quotes
    let stringValue = value.toString();
    // Escape double quotes by doubling them
    stringValue = stringValue.replace(/"/g, '""');
    // Wrap the value in double quotes
    return `"${stringValue}"`;
  };

  // Determine the columns to use
  let keys = columnOrder;
  let columnNames = columnOrder;

  // Create CSV content
  let csvContent = `${columnNames.join(",")}\n`;

  apiData.forEach((row) => {
    const values = keys.map((key) => escapeValue(row[key]));
    csvContent += `${values.join(",")}\n`;
  });

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: getMimeType("csv") });

  // Generate a timestamp for the filename

  // Create a link element to download the CSV file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${baseFilename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getFileNameWithoutExtension = (fileName) =>
  fileName.split(".").slice(0, -1).join(".");

export const removeDomainFromFileName = (fileName) => fileName.split("_")[1];

export const formatNumbersIntoInternationStandard = (number, digits = 2) => {
  if (number >= 1e12) {
    return (number / 1e12).toFixed(digits) + " trillion";
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(digits) + " billion";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(digits) + " million";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(digits) + " thousand";
  } else if (number >= 100) {
    return (number / 100).toFixed(digits) + " hundred";
  } else {
    return number.toString();
  }
};

export const titleCaseFirstWord = (sentence) => {
  // Check if the input is a string
  if (typeof sentence !== "string") {
    throw new TypeError("Input must be a string");
  }
  const words = sentence.trim().split(" ");

  if (words.length > 0 && words[0].length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  return words.join(" ");
}

export const getMimeType = (extension) => {
  const mimeTypes = {
    csv: "text/csv",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    html: "text/html",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
  };
  return mimeTypes[extension] || "application/octet-stream"; // Default MIME type
};

/**
 * Generates a PDF from HTML content with a header, footer, and page number.
 * @param {string} fileName - The name of the generated PDF file.
 * @param {string} htmlString - The HTML content to be converted to PDF.
 * @param {string} title - The title to be displayed in the header.
 * @param {string} logoUrl - The URL of the logo image.
 */

/**
 * Generate a PDF from HTML content.
 *
 * @param {string} fileName - The name of the generated PDF file.
 * @param {string} title - The title for the PDF.
 * @param {string} htmlString - The HTML content to convert to PDF.
 * @param {string} [logoUrl=logo] - Optional URL for the logo image.
 */
export const generatePdfFromHtml = (
  fileName,
  title,
  htmlString,
  logoUrl = logo
) => {
  // Create a temporary container for the HTML content
  const container = document.createElement("div");
  // container.style.position = "absolute";
  // container.style.left = "-9999px"; // Position it off-screen
  // container.style.top = "-9999px"; // Position it off-screen
  // container.style.visibility = "hidden"; // Hide the element

  // Add margins to the HTML content
  container.innerHTML = `
    <style>
      body {
        margin: 0;
        padding: 0;
        font-size: 24px; /* Adjust font size */
      }
      .pdf-content {
        margin: 20mm; /* Adjust margins as needed */
      }
    </style>
    <div class="pdf-content">${htmlString}</div>
  `;

  document.body.appendChild(container);

  html2canvas(container, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10; // Start with margin on top
    let pageNumber = 1;

    // Add header to the first page
    addHeader(pdf, title, logoUrl);

    // Add the first page of content with margin
    pdf.addImage(
      imgData,
      "PNG",
      10,
      position + 10, // Adjust position to accommodate header/footer
      imgWidth - 20,
      imgHeight - 20 // Adjust size to accommodate header/footer
    );
    addFooter(pdf, pageNumber, imgWidth, pageHeight);

    heightLeft -= pageHeight - 20; // Adjust for header and footer
    pageNumber++;

    // Add additional pages
    while (heightLeft >= 0) {
      pdf.addPage();
      addHeader(pdf, title, logoUrl);
      pdf.addImage(
        imgData,
        "PNG",
        10,
        position + 10,
        imgWidth - 20,
        imgHeight - 20
      );
      addFooter(pdf, pageNumber, imgWidth, pageHeight);
      heightLeft -= pageHeight - 20;
      pageNumber++;
    }

    pdf.save(fileName);

    // Clean up temporary container
    document.body.removeChild(container);
  });
};

const addHeader = (pdf, title, logoUrl) => {
  // Add logo
  pdf.addImage(logoUrl, "PNG", 10, 10, 20, 10); // Adjust logo size and position

  // Add title
  pdf.setFontSize(20);
  pdf.text(title, 105, 20, { align: "center" }); // Centered title
};

const addFooter = (pdf, pageNumber, imgWidth, pageHeight) => {
  pdf.setFontSize(12);
  pdf.text(`${pageNumber}`, imgWidth / 2, pageHeight - 10, {
    align: "center",
  }); // Centered page number
};
