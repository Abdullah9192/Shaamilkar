import { useState } from 'react'
import { Document, Page } from 'react-pdf'
import pdf from '../assets/UserStory.pdf'
function PDFViewer({ PDF }) {
  const [numPages, setNumPages] = useState()
  const [pageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <div className="d-flex justify-content-center flex-column">
      <Document file={PDF ? PDF : pdf} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => (
            <>
              <Page
                renderTextLayer={false}
                pageNumber={page}
                renderAnnotationLayer={false}
                scale={'1.3'}
              />
              <span>
                Page {pageNumber} of {numPages}
              </span>
            </>
          ))}
      </Document>
    </div>
  )
}
export default PDFViewer
