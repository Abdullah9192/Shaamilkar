import React, { useState, useEffect } from "react";
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";
import InstallmentModal from "../../Components/InstallmentModal/installmentModal";
import { applicationHistory, installmentPlan } from "../../Atom";
import { useRecoilState } from "recoil";
import { formatTimestamp } from "../../Utils/Utils";

const InstallmentPlan = () => {
  const [userData, setUserData] = useState(null);
  const [product, setProduct] = useState([]);
  const [variantId, setVariantId] = useState(null);
  const [address, setAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [application] = useRecoilState(applicationHistory);
  const [installments_Plan] = useRecoilState(installmentPlan);

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user")));
    setProduct(JSON.parse(localStorage.getItem("products")) || []);
    setVariantId(JSON.parse(localStorage.getItem("variant_id")));
    setAddress(JSON.parse(localStorage.getItem("applicationFormData")));
  }, []);

  const customer = {
    Name: userData?.name || "N/A",
    product: application ? application?.product?.title : "N/A",
    Product_Id: application ? application?.product?.id : "N/A",
    variant_id: application ? application?.product?.variants?.[0]?.id : "N/A",
    address: application ? application?.currentAddress : "N/A",
    Price:
      Number(application?.product?.variants?.[0]?.price).toLocaleString(
        "en-IN"
      ) || "N/A",
  };

  const entries = Object.entries(customer);
  const rows = [];
  for (let i = 0; i < entries.length; i += 2) {
    rows.push(entries.slice(i, i + 2));
  }

  const pendingIndex = installments_Plan?.installments?.findIndex(
    (inst) => inst.status === "U"
  );
  const installmentToShow = installments_Plan?.installments?.find(
    (inst) => inst.status !== "P"
  );
  const installmentIndex = installments_Plan?.installments?.findIndex(
    (inst) => inst.status !== "P"
  );

  const processingFee =
    installmentIndex === 0 && installmentToShow?.amount
      ? installmentToShow.amount * 0.03
      : 0;
  const totalPayable = installmentToShow?.amount
    ? installmentToShow.amount + processingFee
    : 0;

  console.log("Installment to show:", installmentToShow);
  return (
    <div>
      <Navbar />
      <div className="container">
        <h3 className="py-3 fw-bold">Customer Receipt</h3>
        <table className="table table-bordered">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map(([key, value], index) => (
                  <React.Fragment key={index}>
                    <th>
                      {key !== undefined && key !== null
                        ? key.charAt(0).toUpperCase() + key.slice(1)
                        : "N/A"}
                    </th>
                    <td>
                      {value !== undefined && value !== null ? value : "N/A"}
                    </td>
                  </React.Fragment>
                ))}
                {row.length < 2 && (
                  <>
                    <th></th>
                    <td></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <h4 className="py-3 fw-bold">Installment Schedule</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="rounded-3 border overflow-hidden">
              <table className="table mb-0">
                <thead className="table-primary text-center">
                  <tr>
                    <th>Details</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {installments_Plan?.installments?.length ? (
                    installments_Plan.installments.map((item, index) => (
                      <tr
                        key={index}
                        className={item.status === "U"  ? "fw-bold" : ""}
                      >
                        <td>
                          {index === 0
                            ? "Down Payment"
                            : item.installmentNo - 1}
                        </td>
                        <td>{formatTimestamp(item.dueDate)}</td>
                        <td>
                          {Number(item.amount.toFixed(0)).toLocaleString(
                            "en-IN"
                          )}{" "}
                          PKR
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No installments available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded-3 py-3 px-4 text-center bg-light">
              <h5 className="fw-bold">Payment Information</h5>
              <p>
                Your order will be dispatched as soon as your Downpayment is
                received. When making a payment, remember to put your{" "}
                <strong className="text-decoration-underline">
                  CONSUMER NUMBER
                </strong>{" "}
                in any your banking application after selecting onebill.
              </p>
              <>
                <p className="fw-bold">
                  <strong style={{ color: "var(--btncolor)" }}>
                    {pendingIndex === 0
                      ? "Downpayment Amount:"
                      : "Installment Amount:"}
                  </strong>{" "}
                  {installmentToShow?.amount
                    ? Number(
                        installmentToShow.amount.toFixed(0)
                      ).toLocaleString("en-IN")
                    : 0}{" "}
                  PKR
                </p>
                {pendingIndex === 0 ? (
                  <p className="fw-bold">
                    <strong style={{ color: "var(--btncolor)" }}>
                      3% Processing Fee:
                    </strong>{" "}
                    {Number(processingFee.toFixed(0)).toLocaleString("en-IN")}{" "}
                    PKR
                  </p>
                ) : (
                  ""
                )}
                <p className="fw-bold">
                  <strong style={{ color: "var(--btncolor)" }}>
                    Total Payable:
                  </strong>{" "}
                  {installmentToShow?.amount
                    ? Number(totalPayable.toFixed(0)).toLocaleString("en-IN")
                    : 0}{" "}
                  PKR
                </p>
                <p className="fw-bold">
                  <strong style={{ color: "var(--btncolor)" }}>
                    Consumer Number:
                  </strong>
                  {installmentToShow?.consumerNumber
                    ? " 101760" + installmentToShow?.consumerNumber
                    : "N/A"}{" "}
                </p>
              </>
            </div>
          </div>
        </div>
        <div className="py-3 align-items-center justify-content-center d-flex">
          <button
            style={{ backgroundColor: "var(--btncolor)" }}
            className="btn w-50 shadow-none button"
            onClick={() => setIsModalOpen(true)}
          >
            Got It Thanks!
          </button>
          <InstallmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            installments={installments_Plan?.installments}
            lastPaidDate="01/05/2025"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstallmentPlan;
