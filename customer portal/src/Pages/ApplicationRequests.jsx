import { Modal, Button } from "react-bootstrap";
import Navbar from "../Components/Navbar/Navbar";
import React, { useState, useEffect } from "react";
import MusawamahPDF from "../assets/Docs/musawamahAgrrement.pdf";
import AcknowledgmentPDF from "../assets/Docs/AcknowldgementDraft.pdf";
import UndertakingPDF from "../assets/Docs/UndertakingSKFS.pdf";
import PDFViewer from "../Components/PDFViewer/PDFViewer";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegFileAlt } from "react-icons/fa";
import { BASE_URL } from "../BASE_URL";
import SignatureCanvas from "react-signature-canvas";
import SaveSignedPDF from "../Components/SaveSignedPDf/SaveSignedPdf";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { applicationHistory, installmentPlan } from "../Atom";
import AcceptModal from "../Components/TermsAndConditionsModal/AcceptModal";

const ApplicationRequests = () => {
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalSign, setShowModalSign] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [visibleRows, setVisibleRows] = useState({});
  const [signature, setSignature] = useState(null);
  const [pdf, setPdf] = useState({});
  const [applicationId, setApplicationId] = useState({});
  const navigate = useNavigate();
  const [application, setApplication] = useRecoilState(applicationHistory);
  const [InstallementAtom, setinstallmentAtom] =
    useRecoilState(installmentPlan);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApplications();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user.id;
  // console.log(user);
  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/application/getsingleapplication/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Full API Response:", response);

      if (response.data.status === "error") {
        toast.error(response.data.message);
      } else if (response.data.status === "success") {
        // toast.success(response.data.message);
        setinstallmentAtom(response.data.Application.installmentPlan);
        setData(response.data.Application);
        setApplication(response.data.Application);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch application data.");
    }
  };
  // console.log(data);
  const HandlePdfViewer = (pdfDoc) => {
    setPdf(pdfDoc);
    console.log("app id :", applicationId);
    setShowModalSign(true);
  };
  const handleClose = () => {
    setShowModalSign(false);
  };
  const downloadPDF = (base64String, fileName = "document.pdf") => {
    try {
      if (!base64String) {
        console.error("Base64 string is empty!");
        return;
      }

      const base64WithoutPrefix = base64String
        .replace(/^data:application\/pdf;base64,/, "")
        .trim();
      const binaryString = atob(base64WithoutPrefix);
      const byteNumbers = new Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteNumbers[i] = binaryString.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error decoding Base64 PDF:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-3">
        <h2 className="my-3 fw-bold">Applications List</h2>
        <div
          className="table-responsive rounded-4 mt-4"
          style={{ height: "100vh" }}
        >
          <table className="mb-0 border table align-middle w-100 text-center table-hover bg-white">
            <thead className="text-nowrap">
              <tr>
                <th>Application ID</th>
                <th>Device Name</th>
                <th>Make</th>
                <th>Model</th>
                <th>Variant</th>
                <th>Status</th>
                {data?.status === "Approved" && (
                  <th className="text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              <React.Fragment>
                <tr>
                  <td>{data?.id}</td>
                  <td>{data?.product?.title || "N/A"}</td>
                  <td>
                    {data?.product?.title
                      ? data.product.title.split(" ")[0]
                      : "N/A"}
                  </td>
                  <td>
                    {data?.product?.title
                      ? data.product.title.split(" ").slice(1).join(" ")
                      : "N/A"}
                  </td>
                  <td>{data?.product?.variants?.[0]?.option1 || "N/A"}</td>
                  <td className="fw-semibold text-emphasis">
                    <div
                      className={`${
                        data?.status === "Pending"
                          ? "bg-warning"
                          : data?.status === "Approved"
                          ? "bg-success"
                          : "bg-danger"
                      } text-white w-100 py-0 rounded-pill`}
                    >
                      {data?.status || "N/A"}
                    </div>
                  </td>

                  {data?.status === "Approved" && (
                    <td className="d-flex justify-content-center gap-2">
                      <Button
                        className="btn button border-0 text-white fw-bold py-2 rounded-2 px-4 shadow-none"
                        onClick={() => {
                          setApplicationId(data.id);
                          setShowModal(true);
                        }}
                      >
                        Sign
                      </Button>

                      {data?.signaturepdf?.musawamah &&
                        data?.signaturepdf?.acknowledgement &&
                        data?.signaturepdf?.undertaking && (
                          <Button
                            className="btn btn-secondary py-0 rounded-2"
                            onClick={() => navigate("/InstallmentPlan")}
                          >
                            Installment Details
                          </Button>
                        )}
                    </td>
                  )}
                </tr>
                {visibleRows[0] ? (
                  <tr>
                    <td className="px-5 py-2 w-100 text-start" colSpan="8">
                      <div className="p-4">
                        <div>
                          <h5> Description</h5>
                          <p className="mt-1">
                            {/* {row.description || "No description available"} */}
                          </p>
                        </div>
                        <div
                          className="p-3"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          {data.product.map((section, index) => (
                            <div
                              key={index}
                              style={{ flex: "1 1 30%", minWidth: "200px" }}
                            >
                              <h5>{section.title}:</h5>
                              <ul
                                style={{
                                  listStyleType: "none",
                                  paddingLeft: 0,
                                }}
                              >
                                {section.content.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            </tbody>
          </table>
        </div>
        <Modal
          className="modal text-center"
          show={showModal}
          onHide={() => setShowModal(false)}
          size="md"
          dialogClassName=""
          centered
        >
          <Modal.Header style={{ backgroundColor: "#e0e0e0" }} closeButton>
            <Modal.Title>Agreements</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              backgroundColor: "#e0e0e0",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
          >
            <div>
              <div className="col-12">
                {data && data?.signaturepdf?.musawamah == null ? (
                  <div className="bg-white rounded mb-2 py-3 d-flex align-items-center justify-content-between px-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-success text-white d-flex justify-content-center align-items-center rounded-circle"
                        style={{ width: 45, height: 45 }}
                      >
                        <FaRegFileAlt size={25} />
                      </div>
                      <span className="text-dark fw-bold">Agreement</span>
                    </div>
                    <button
                      className="btn button border-0 text-white fw-bold py-2 rounded-2 px-4"
                      onClick={() => HandlePdfViewer("MusawamahPDF")}
                    >
                      Sign
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded mb-2 py-3 d-flex align-items-center justify-content-between px-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-success text-white d-flex justify-content-center align-items-center rounded-circle"
                        style={{ width: 45, height: 45 }}
                      >
                        <FaRegFileAlt size={25} />
                      </div>
                      <span className="text-dark fw-bold">Agreement</span>
                    </div>
                    <button
                      className="btn btn-info"
                      onClick={() =>
                        downloadPDF(
                          data.signaturepdf.musawamah,
                          "musawamahSigned.pdf"
                        )
                      }
                    >
                      Download
                    </button>
                  </div>
                )}
              </div>
              <div className="col-12">
                {data && data?.signaturepdf?.acknowledgement == null ? (
                  <div className="bg-white rounded mb-2 py-3 d-flex align-items-center justify-content-between px-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-success text-white d-flex justify-content-center align-items-center rounded-circle"
                        style={{ width: 45, height: 45 }}
                      >
                        <FaRegFileAlt size={25} />
                      </div>
                      <span className="text-dark fw-bold">Acknowledgement</span>
                    </div>
                    <button
                      className="btn button border-0 text-white fw-bold py-2 rounded-2 px-4"
                      onClick={() => HandlePdfViewer("AcknowledgementPDF")}
                    >
                      Sign
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded mb-2 py-3 d-flex align-items-center justify-content-between px-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-success text-white d-flex justify-content-center align-items-center rounded-circle"
                        style={{ width: 45, height: 45 }}
                      >
                        <FaRegFileAlt size={25} />
                      </div>
                      <span className="text-dark fw-bold">Acknowledgement</span>
                    </div>
                    <button
                      className="btn btn-info"
                      onClick={() =>
                        downloadPDF(
                          data.signaturepdf.acknowledgement,
                          "acknowledgementSigned.pdf"
                        )
                      }
                    >
                      Download
                    </button>
                  </div>
                )}
              </div>
              <div className="col-12">
                {data && data?.signaturepdf?.undertaking == null ? (
                  <div className="bg-white rounded mb-2 py-3 d-flex align-items-center justify-content-between px-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-success text-white d-flex justify-content-center align-items-center rounded-circle"
                        style={{ width: 45, height: 45 }}
                      >
                        <FaRegFileAlt size={25} />
                      </div>
                      <span className="text-dark fw-bold"> Undertaking</span>
                    </div>
                    <button
                      className="btn button border-0 text-white fw-bold py-2 rounded-2 px-4"
                      onClick={() => HandlePdfViewer("UndertakingPDF")}
                    >
                      Sign
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded mb-2 py-3 d-flex align-items-center justify-content-between px-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-success text-white d-flex justify-content-center align-items-center rounded-circle"
                        style={{ width: 45, height: 45 }}
                      >
                        <FaRegFileAlt size={25} />
                      </div>
                      <span className="text-dark fw-bold"> Undertaking</span>
                    </div>
                    <button
                      className="btn btn-info"
                      onClick={() =>
                        downloadPDF(
                          data.signaturepdf.undertaking,
                          "undertakingSigned.pdf"
                        )
                      }
                    >
                      Download
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          className="text-center"
          show={showModalSign}
          onHide={() => setShowModalSign(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Agreement</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <div className="modal-scrollbar">
              {pdf == "MusawamahPDF" ? (
                <PDFViewer PDF={MusawamahPDF} />
              ) : pdf == "AcknowledgementPDF" ? (
                <PDFViewer PDF={AcknowledgmentPDF} />
              ) : pdf == "UndertakingPDF" ? (
                <PDFViewer PDF={UndertakingPDF} />
              ) : (
                <span>No Pdf Found</span>
              )}

              <h4 className="text-start mt-3">Add Customer Signature here</h4>
              <div className="border border-black">
                <SignatureCanvas
                  penColor="red"
                  ref={(ref) => setSignature(ref)}
                  canvasProps={{
                    width: 700,
                    height: 200,
                    className: "sigCanvas",
                  }}
                />
              </div>
              <div className="d-flex gap-3 justify-content-center mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    signature.clear();
                  }}
                >
                  clear
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    if (signature.isEmpty())
                      return toast.error("Please Sign First");

                    let updatedData;
                    if (pdf === "MusawamahPDF") {
                      updatedData = SaveSignedPDF(
                        MusawamahPDF,
                        signature,
                        pdf,
                        applicationId,
                        setShowAcceptModal,
                        data
                      );

                      setData((prevState) => {
                        const updatedSignaturepdf = {
                          ...prevState.signaturepdf,
                          musawamah: updatedData,
                        };
                        return {
                          ...prevState,
                          signaturepdf: updatedSignaturepdf,
                        };
                      });
                    } else if (pdf === "AcknowledgementPDF") {
                      updatedData = SaveSignedPDF(
                        AcknowledgmentPDF,
                        signature,
                        pdf,
                        applicationId,
                        setShowAcceptModal,
                        data
                      );

                      setData((prevState) => {
                        const updatedSignaturepdf = {
                          ...prevState.signaturepdf,
                          acknowledgement: updatedData,
                        };
                        return {
                          ...prevState,
                          signaturepdf: updatedSignaturepdf,
                        };
                      });
                    } else if (pdf === "UndertakingPDF") {
                      updatedData = SaveSignedPDF(
                        UndertakingPDF,
                        signature,
                        pdf,
                        applicationId,
                        setShowAcceptModal,
                        data
                      );

                      setData((prevState) => {
                        const updatedSignaturepdf = {
                          ...prevState.signaturepdf,
                          undertaking: updatedData,
                        };
                        return {
                          ...prevState,
                          signaturepdf: updatedSignaturepdf,
                        };
                      });
                    } else {
                      toast.error("No PDF Found");
                    }

                    handleClose();
                  }}
                >
                  Save Signed PDF
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <AcceptModal
          show={showAcceptModal}
          onHide={() => setShowAcceptModal(false)}
        />
      </div>
    </>
  );
};

export default ApplicationRequests;
