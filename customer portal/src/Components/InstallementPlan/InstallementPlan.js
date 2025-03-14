import React, { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { installmentPlan } from "../../Atom";

export const postApplication = async (
  product,
  downPayment,
  productPrice,
  interestRatio,
  createdAt,
  installments,
  setInstallments_Plan
) => {
  let obj = {
    productName: product?.title || "Unknown Product",
    originalPrice: parseFloat(product?.variants?.[0]?.price) || 0,
    selectedPlan: `${localStorage.getItem("plan")} months`,
    downPayment: parseFloat(downPayment.toFixed(2)),
    remainingAmount: parseFloat(
      (productPrice + productPrice * interestRatio).toFixed(2)
    ),
    createdAt: createdAt.toString(),
    installments: installments.map((installment) => ({
      installmentNo: installment.installmentNo,
      amount: parseFloat(installment.amount),
      amountWithInDueDate: parseFloat(installment.amount),
      amountAfterDueDate:
        parseFloat(
          (
            (parseFloat(installment.amount) / 100) *
              parseFloat(installment.penalty) +
            parseFloat(installment.amount)
          ).toFixed(2)
        ) || parseFloat(installment.amount),
      penalty: parseFloat(installment.penalty) || 0,
      dueDate: installment.dueDate.toString(),
      status: installment.status,
    })),
  };

  console.log(obj, "my final installment plan");
  setInstallments_Plan(obj);
  localStorage.setItem("installmentPlan", JSON.stringify(obj));

  // Uncomment below to make the API call:
  // await axios
  //   .post("http://localhost:5000/api/installmentPlans", obj)
  //   .then((response) => console.log("Installment data stored:", response.data))
  //   .catch((error) => console.error("Error saving installment data:", error));
};

const InstallmentPlan = () => {
  const [installments_Plan, setInstallments_Plan] =
    useRecoilState(installmentPlan);
  useEffect(() => {
    const product = JSON.parse(localStorage.getItem("selectedproduct"));

    if (!product) {
      console.error("Product not found in localStorage");

      return; // Exit if no product is found
    }

    let productPrice = parseFloat(product?.variants?.[0]?.price) || 0;
    let plan = parseInt(localStorage.getItem("plan")) || 12; // Default to 12 months
    let interestRatio;
    if (plan == 12) {
      interestRatio = 36 / 100;
    } else if (plan == 9) {
      interestRatio = 27 / 100;
    } else if (plan == 6) {
      interestRatio = 18 / 100;
    } else if (plan == 3) {
      interestRatio = 9 / 100;
    } else {
      alert("Please select a valid plan");
      console.error("Invalid plan selected");
      return false;
    }
    let downPayment = productPrice * 0.3;
    productPrice -= downPayment;
    let monthlyPayment = (productPrice + productPrice * interestRatio) / plan;

    let createdAt = new Date();
    let firstDueDate = new Date(createdAt);
    firstDueDate.setDate(firstDueDate.getDate() + 10);

    let installments = [];

    // Add down payment as the first installment
    installments.push({
      installmentNo: 1,
      amount: downPayment.toFixed(2),
      dueDate: createdAt.toString(),
      penalty: 0,
      status: "U",
    });

    // Append the regular monthly installments
    for (let i = 0; i < plan; i++) {
      let dueDate = new Date(firstDueDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      installments.push({
        installmentNo: i + 2,
        amount: monthlyPayment.toFixed(2),
        penalty: 2.5,
        dueDate: dueDate.toString(),
        status: "U",
      });
    }

    postApplication(
      product,
      downPayment,
      productPrice,
      interestRatio,
      createdAt,
      installments,
      setInstallments_Plan
    );
  }, []);

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <th scope="col" colSpan={2} className="fs-5">
            Installment Plan
          </th>
        </thead>
        <tbody>
          <tr>
            <td>Total Amount</td>
            <td>
              {Number(
                installments_Plan?.downPayment +
                  installments_Plan?.remainingAmount
              ).toLocaleString("en-IN") || "N/A"}
            </td>
          </tr>
          <tr>
            <td>Down Payment</td>
            <td>
              {Number(installments_Plan?.downPayment).toLocaleString("en-IN") ||
                "N/A"}
            </td>
          </tr>
          <tr>
            <td>Monthly Installment</td>
            <td>
              {Number(
                installments_Plan?.installments?.[1]?.amount
              ).toLocaleString("en-IN") || "N/A"}
            </td>
          </tr>
          <tr>
            <td>Selected Plan</td>
            <td>{installments_Plan?.selectedPlan || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InstallmentPlan;
