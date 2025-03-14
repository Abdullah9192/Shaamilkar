import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import axios from "axios";
import { BASE_URL } from "../../BASE_URL";

const SaveSignedPDF = async (
  pdfFile,
  signatureRef,
  pdfType,
  appId,
  handleClose,
  setShowAcceptModal,
  data
) => {
  if (!signatureRef || !signatureRef.toDataURL) {
    console.error("One or both signature references are invalid");
    return;
  }
  console.log(appId, "appId in pdf saver");
  const signatureDataUrl = signatureRef.toDataURL("image/png");

  const signatureImageBytes = await fetch(signatureDataUrl).then((res) =>
    res.arrayBuffer()
  );

  const existingPdfBytes = await fetch(pdfFile).then((res) =>
    res.arrayBuffer()
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];
  const { width, height } = lastPage.getSize();

  // Define positions for different PDFs
  const positionMap = {
    MusawamahPDF: { signature: { x: 210, y: 350 } },
    AcknowledgementPDF: {
      signature: { x: 200, y: 400 },
    },
    UndertakingPDF: {
      signature: { x: 380, y: 385 },
    },
  };

  const { signature } = positionMap[pdfType] || {
    signature: { x: 20, y: 10 },
  };

  // Draw primary signature
  lastPage.drawImage(signatureImage, {
    x: signature.x,
    y: signature.y,
    width: 90,
    height: 50,
  });

  const signedPdfBytes = await pdfDoc.save();
  const blob = new Blob([signedPdfBytes], { type: "application/pdf" });
  const formData = new FormData();
  console.log(pdfType);

  if (pdfType === "AcknowledgementPDF") {
    formData.append("signaturepdf", blob, "acknowledgement.pdf");
    console.log("1");
  } else if (pdfType === "UndertakingPDF") {
    formData.append("signaturepdf", blob, "undertaking.pdf");
    console.log("2");
  } else if (pdfType === "MusawamahPDF") {
    formData.append("signaturepdf", blob, "musawamah.pdf");
    console.log("3");
  } else {
    console.log("error in saving pdf");
    return false;
  }
  console.log([...formData.entries()], "Form Data");
  await axios
    .patch(`${BASE_URL}/application/updateapplication/${appId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      if (pdfType === "AcknowledgementPDF") {
        saveAs(blob, "acknowledgement.pdf");
      } else if (pdfType === "UndertakingPDF") {
        saveAs(blob, "undertaking.pdf");
      } else if (pdfType === "MusawamahPDF") {
        saveAs(blob, "musawamah.pdf");
      } else {
        console.log("error in saving pdf");
        return false;
      }
      handleClose(false);
      console.log(res);
      if (res.updatedApplication.signaturepdf.length == 3) {
        setShowAcceptModal(true);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export default SaveSignedPDF;
