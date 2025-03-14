import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
function PDFViewer({ PDF }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className="d-flex justify-content-center flex-column">
      <Document
        file={PDF}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.log(error, "error loading pdf")}
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
          <div key={page}>
            <Page
              renderTextLayer={false}
              pageNumber={page}
              renderAnnotationLayer={false}
              scale={1.2}
            />
            <span>
              Page {page} of {numPages}
            </span>
          </div>
        ))}
      </Document>
    </div>
  );
}
export default PDFViewer;
