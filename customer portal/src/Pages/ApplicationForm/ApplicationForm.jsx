import React, { useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button } from "react-bootstrap";
import { BiPlus, BiTrash } from "react-icons/bi";
import Footer from "../../Components/Footer/Footer.jsx";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import Disclaimer from "../../Components/DisclaimerModal/Disclaimer.jsx";
import DynamicFields from "../../Components/DynamicFields/DynamicFields.jsx";
import AcceptModal from "../../Components/TermsAndConditionsModal/AcceptModal.jsx";
import TermsAndConditions from "../../Components/TermsAndConditionsModal/TermsAndConditions.jsx";
import InstallementPlan from "../../Components/InstallementPlan/InstallementPlan.js";
import ProductDetails from "../../Components/ProductDetails/ProductDetils.jsx";
import { installmentPlan } from "../../Atom.js";
import { useRecoilState } from "recoil";

const ApplicationForm = () => {
  const [referenceRows, setReferenceRows] = useState([{}]);
  const [modalShow, setModalShow] = useState(true);
  const [formData, setFormData] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const phoneRegExp = /^(?:\+92|0)[0-9]{10}$/;
  const storedUserData = JSON.parse(localStorage.getItem("user"));
  const [InstallementAtom, setinstallmentAtom] =
    useRecoilState(installmentPlan);

  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    fatherName: "",
    gender: "",
    husbandName: "",
    dateOfBirth: "",
    mobileNumber: storedUserData?.phoneNumber || "",
    currentAddress: "",
    cnic: storedUserData?.cnic || "",
    cnicFrontPhoto: "",
    cnicBackPhoto: "",
    city: "",
    email: storedUserData?.email || "",
    livingSince: "",
    residenceType: "",
    jobTitle: "",
    occupation: "",
    occupationStatus: "",
    organizationName: "",
    organizationAddress: "",
    workingSince: "",
    phoneOffice: "",
    sixMonthBankStatement: "",
    lastPaySlip: "",
    utilityBill: "",
    referenceInfo: [
      {
        referenceFullName: "",
        referenceCnic: "",
        referenceContactNumber: "",
        referenceRelation: "",
      },
    ],
    earningPerMonth: "",
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    middleName: Yup.string(),
    lastName: Yup.string().required("Last Name is required"),
    fatherName: Yup.string(),
    husbandName: Yup.string(),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string().required("email is required"),
    dateOfBirth: Yup.date().required("Date of Birth is required"),
    mobileNumber: Yup.string()
      .required("Mobile Number is required")
      .matches(
        phoneRegExp,
        "Invalid number (e.g. +923xxxxxxxxx or 03xxxxxxxxx)"
      ),
    cnic: Yup.string()
      .required("CNIC is required")
      .matches(/^\d+$/, "Only numeric values")
      .length(13, "CNIC must 13 digits"),
    city: Yup.string()
      .required("City is required")
      .oneOf(
        [
          "Lahore",
          "Karachi",
          "Islamabad",
          "Multan",
          "Rawalpindi",
          "Peshawar",
          "Quetta",
          "Sialkot",
          "Gujranwala",
          "Hyderabad",
          "Bahawalpur",
          "Sargodha",
          "Sukkur",
          "Abbottabad",
          "Sheikhupura",
          "Jhang",
          "Gujrat",
          "Other City",
        ],
        "Invalid city selected"
      ),
    currentAddress: Yup.string().required("Current Address is required"),
    livingSince: Yup.string().required("Living Since is required"),
    residenceType: Yup.string().required("Residence Type is required"),
    jobTitle: Yup.string().when("occupation", {
      is: (val) => val === "Unemployed",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("job title is required"),
    }),

    occupation: Yup.string().required("Occupation is required"),
    occupationStatus: Yup.string().when("occupation", {
      is: (val) => val === "Unemployed",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Occupation is required"),
    }),
    organizationAddress: Yup.string().when("occupation", {
      is: (val) => val === "Unemployed",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Address is required"),
    }),
    workingSince: Yup.string().when("occupation", {
      is: (val) => val === "Unemployed",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("WorkingSince is required"),
    }),

    earningPerMonth: Yup.string().when("occupation", {
      is: (val) => val === "Unemployed",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Income is required"),
    }),

    cnicFrontPhoto: Yup.mixed().required("CNIC Front Photo is required"),
    cnicBackPhoto: Yup.mixed().required("CNIC Back Photo is required"),
    sixMonthBankStatement: Yup.mixed().required("Bank Statement is required"),
    lastPaySlip: Yup.mixed().required("Pay Slip is required"),
    utilityBill: Yup.mixed().required("Utility Bill is required"),

    referenceInfo: Yup.array().of(
      Yup.object().shape({
        referenceFullName: Yup.string().required("Full Name is required"),
        referenceCnic: Yup.string()
          .required("CNIC is required")
          .matches(/^\d+$/, "Only numeric values")
          .length(13, "CNIC must 13 digits"),
        referenceContactNumber: Yup.string()
          .required("Phone is required")
          .matches(
            phoneRegExp,
            "Invalid number (e.g. +923xxxxxxxxx or 03xxxxxxxxx)"
          ),
        referenceRelation: Yup.string().required("Relation is required"),
      })
    ),
  }).test(
    "father-or-husband-name",
    "Either Father Name or Husband Name is required",
    function (values) {
      return !!values.fatherName || !!values.husbandName;
    }
  );
  //static product
  const getPlan = JSON.parse(localStorage.getItem("plan"));
  const getProductId = JSON.parse(localStorage.getItem("product_id"));
  const productName = JSON.parse(localStorage.getItem("selectedproduct"));
  console.log(productName)
  const products = [
    {
      name: productName,
      price: 100000,
      id: getProductId,
      make: "Infinix",
      variant: "black",
      model: "A05",
      plan: getPlan,
    },
  ];
  localStorage.setItem("products", JSON.stringify(products));
  let selectedProduct = JSON.parse(localStorage.getItem("selectedproduct"));
  // let installmentPlan = JSON.parse(localStorage.getItem("installmentPlan"));

  const handleSubmit = (values) => {
    console.log(values);
    const formData = new FormData();

    formData.append("firstName", values.firstName);
    formData.append("middleName", values.middleName);
    formData.append("lastName", values.lastName);
    formData.append("fatherName", values.fatherName);
    formData.append("husbandName", values.husbandName);
    formData.append("gender", values.gender);
    formData.append("dateOfBirth", values.dateOfBirth);
    formData.append("mobileNumber", values.mobileNumber);
    formData.append("cnic", values.cnic);
    formData.append("cnicFrontPhoto", values.cnicFrontPhoto);
    formData.append("cnicBackPhoto", values.cnicBackPhoto);
    formData.append("email", values.email);
    formData.append("currentAddress", values.currentAddress);
    formData.append("city", values.city);
    formData.append("residenceType", values.residenceType);
    formData.append("livingSince", values.livingSince);
    formData.append("jobTitle", values.jobTitle);
    formData.append("occupation", values.occupation);
    formData.append("occupationStatus", values.occupationStatus);
    formData.append("organizationName", values.organizationName);
    formData.append("organizationAddress", values.organizationAddress);
    formData.append("workingSince", values.workingSince);
    formData.append("phoneOffice", values.phoneOffice);
    formData.append("earningPerMonth", values.earningPerMonth);
    formData.append("referenceInfo", JSON.stringify(values.referenceInfo));
    formData.append("sixMonthBankStatement", values.sixMonthBankStatement);
    formData.append("lastPaySlip", values.lastPaySlip);
    formData.append("utilityBill", values.utilityBill);
    formData.append("product", JSON.stringify(selectedProduct));
    console.log(InstallementAtom, "installment plan");
    formData.append("installmentPlan", JSON.stringify(InstallementAtom));
    // formData.append("product", JSON.stringify(products));
    // Append user ID and get from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user.id, typeof user.id, "user id");
    formData.append("userId", parseInt(user.id, 10));
    setFormData(formData);
    setShowTermsModal(true);
    console.log(formData);
  };
  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
  };
  const personalFieldsConfig = [
    {
      label: "First Name",
      id: "firstName",
      name: "firstName",
      type: "text",
      placeholder: "First Name",
      className: "form-control",
    },
    {
      label: "Middle Name",
      id: "middleName",
      name: "middleName",
      type: "text",
      placeholder: "Middle Name",
      className: "form-control",
    },
    {
      label: "Last Name",
      id: "lastName",
      name: "lastName",
      type: "text",
      placeholder: "Last Name",
      className: "form-control",
    },
    {
      label: "Father Name",
      id: "fatherName",
      name: "fatherName",
      type: "text",
      placeholder: "Father Name",
      className: "form-control",
    },
    {
      label: "Gender",
      id: "gender",
      name: "gender",
      type: "select",
      placeholder: "Gender",
      className: "form-select",
      options: ["Male", "Female"],
    },
    {
      label: "Husband Name",
      id: "husbandName",
      name: "husbandName",
      type: "text",
      placeholder: "Husband Name",
      className: "form-control",
    },

    {
      label: "Date of Birth",
      id: "dateOfBirth",
      name: "dateOfBirth",
      type: "date",
      placeholder: "Date",
      className: "form-control",
    },
    {
      label: "Mobile Number",
      id: "mobileNumber",
      name: "mobileNumber",
      type: "tel",
      placeholder: "03xxxxxxxxx",
      pattern: "^(\\+92|0)[0-9]{10}$",
      className: "form-control",
    },
    {
      label: "CNIC",
      id: "cnic",
      name: "cnic",
      type: "number",
      placeholder: "CNIC xxxxxxxxxxxxx",
      className: "form-control",
    },
    {
      label: "CNIC Front Photo",
      id: "cnicFrontPhoto",
      name: "cnicFrontPhoto",
      type: "image",
      className: "form-control",
    },
    {
      label: "CNIC back Photo",
      id: "cnicBackPhoto",
      name: "cnicBackPhoto",
      type: "image",
      className: "form-control",
    },
    {
      label: "Email Address",
      id: "email",
      name: "email",
      type: "email",
      placeholder: "Email Address",
      className: "form-control",
    },
    {
      label: "Current Address",
      id: "currentAddress",
      name: "currentAddress",
      type: "text",
      placeholder: "Current Address",
      className: "form-control",
    },
    {
      label: "City",
      id: "city",
      name: "city",

      type: "select",
      placeholder: "City",
      options: [
        "Lahore",
        "Karachi",
        "Islamabad",
        "Multan",
        "Rawalpindi",
        "Faisalabad",
        "Peshawar",
        "Quetta",
        "Sialkot",
        "Gujranwala",
        "Hyderabad",
        "Bahawalpur",
        "Sargodha",
        "Sukkur",
        "Abbottabad",
        "Sheikhupura",
        "Jhang",
        "Gujrat",
        "Other City",
      ],
      className: "form-select",
    },
    {
      label: "Living Since",
      id: "livingSince",
      name: "livingSince",
      type: "select",
      options: Array.from({ length: new Date().getFullYear() - 1969 }, (_, i) =>
        (1970 + i).toString()
      ),
      className: "form-select",
    },
    {
      label: "Residence Type",
      id: "residenceType",
      name: "residenceType",
      type: "select",
      options: ["Rented", "Owned"],

      className: "form-select",
    },
  ];
  const FieldsConfig = [
    {
      label: "Occupation Status",
      id: "occupation",
      name: "occupation",
      type: "select",
      options: ["Self Employed", "Employed", "Unemployed"],
      className: "form-select",
    },
    {
      label: "Occupation ",
      id: "occupationStatus",
      name: "occupationStatus",
      type: "select",
      placeholder: "Occupation",
      options: [
        "Marketing",
        "Industry",
        "Customer Service",
        "Corporate",
        "Medical",
        "Education",
        "Engineering",
        "Lawyer",
        "Agriculture & Farming",
        "Textile & Garments",
        "IT & Software",
        "Finance & Banking",
        "Arts & Entertainment",
        "Construction",
        "Real Estate",
        "Freelancer",
        "Others",
      ],
      className: "form-select",
    },
    {
      label: "Job Description/Title",
      id: "jobTitle",
      name: "jobTitle",

      type: "text",
      placeholder: "Job Description/Title",
      className: "form-control",
    },
    {
      label: "Organization Name",
      id: "organizationName",
      name: "organizationName",
      type: "text",
      placeholder: "Organization Name",
      className: "form-control",
    },
    {
      label: "Organization Address",
      id: "organizationAddress",
      name: "organizationAddress",
      type: "text",
      placeholder: "Organization Address",
      className: "form-control",
    },
    {
      label: "Working Since",
      id: "workingSince",
      name: "workingSince",
      type: "select",
      options: Array.from({ length: new Date().getFullYear() - 1969 }, (_, i) =>
        (1970 + i).toString()
      ),
      className: "form-select",
    },
    {
      label: "Office Number",
      id: "phoneOffice",
      name: "phoneOffice",
      type: "tel",
      placeholder: "03xxxxxxxxx",
      className: "form-control",
      pattern: "^(\\+92|0)[0-9]{10}$",
    },
    {
      label: "Monthly Income",
      id: "earningPerMonth",
      name: "earningPerMonth",
      type: "number",
      placeholder: "Monthly Income",
      className: "form-control",
    },
  ];
  const RefferenceFieldConfig = [
    {
      name: "referenceFullName",
      label: "Full Name",
      placeholder: "Full Name",
      className: "form-control",
      type: "text",
    },
    {
      name: "referenceCnic",
      label: "CNIC",
      placeholder: "CNIC xxxxxxxxxxxxx",
      className: "form-control",
      type: "number",
      maxLength: 13,
    },
    {
      name: "referenceContactNumber",
      className: "form-control",
      label: "Contact Number",
      placeholder: "03xxxxxxxxx",
      type: "tel",
      pattern: "^(\\+92|0)[0-9]{10}$",
    },
    {
      name: "referenceRelation",
      className: "form-control",
      label: "Relation",
      placeholder: "Relation",
      type: "text",
    },
  ];
  const FinancialFieldConfig = [
    {
      name: "sixMonthBankStatement",
      label: "6 Month Bank Statement",
      placeholder: "6 Month Bank Statement",
      type: "image",
      className: "form-control",
    },
    {
      name: "lastPaySlip",
      label: "Last Salary Slip",
      placeholder: "lastPaySlip",
      type: "image",
      className: "form-control",
    },
    {
      name: "utilityBill",
      label: "Utility Bill",
      placeholder: "Utility Bill",
      type: "image",
      className: "form-control",
    },
  ];
  const addReferenceRow = () => {
    setReferenceRows([...referenceRows, {}]);
  };
  const deleteReferenceRow = (index) => {
    const updatedRows = referenceRows.filter((_, i) => i !== index);
    setReferenceRows(updatedRows);
  };

  return (
    <>
      <Navbar />
      <ProductDetails />
      <div className="container pb-3 pt-4">
        <h2 className="py-3 fw-bold">Application Form</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleChange, handleBlur }) => (
            <Form>
              <h3 className="fw-bold mt-3">Personal Information</h3>
              <div className="row">
                {personalFieldsConfig.map(
                  (field, index) =>
                    !(
                      field.name === "husbandName" && values.gender !== "Female"
                    ) && (
                      <div className="col-md-3" key={index + field.name}>
                        <DynamicFields
                          id={field.name}
                          label={field.label}
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          options={field.options}
                          className={field.className}
                          setFieldValue={setFieldValue}
                          onChange={(e) =>
                            field.name === "gender" &&
                            setFieldValue("gender", e.target.value)
                          }
                          onFileChange={(files, name) => {
                            if (files && files.length > 0) {
                              setFieldValue(name, files[0]);
                            } else {
                              setFieldValue(name, null);
                            }
                          }}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          values={values}
                        />
                      </div>
                    )
                )}
              </div>
              <h3 className="fw-bold mt-3">Work /Employment Information</h3>
              <div className="row">
                {FieldsConfig.map((field, index) => {
                  let fieldType = field.type;
                  let classes = field.className;
                  if (
                    field.name === "occupationStatus" &&
                    values.occupation === "Self Employed"
                  ) {
                    fieldType = "text";
                    classes = "form-control";
                  }

                  return (
                    <div className="col-md-3" key={index + field.name}>
                      <DynamicFields
                        id={field.name}
                        label={field.label}
                        type={fieldType}
                        name={field.name}
                        placeholder={field.placeholder}
                        options={field.options}
                        className={classes}
                        onFileChange={handleFileChange}
                      />
                    </div>
                  );
                })}
              </div>
              <h3 className="fw-bold mt-3">Reference Information</h3>
              {referenceRows.map((_, index) => (
                <div className="d-flex gap-2" key={index + _}>
                  <div
                    key={index}
                    className="row w-100"
                    style={{ width: "100%" }}
                  >
                    {RefferenceFieldConfig.map((field, fieldIndex) => (
                      <div
                        className="col-md-3"
                        key={index + fieldIndex + field.name}
                      >
                        <DynamicFields
                          key={fieldIndex}
                          id={`${field.name}_${index}`}
                          label={field.label}
                          type={field.type}
                          name={`referenceInfo[${index}].${field.name}`}
                          placeholder={field.placeholder}
                          className={field.className}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="d-flex gap-2 align-items-center justify-content-center">
                    {index === 0 || (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => deleteReferenceRow(index)}
                        className="btn border border-danger text-danger mt-2 btn-md  d-flex justify-content-center align-items-center square"
                      >
                        <BiTrash />
                      </Button>
                    )}
                    {index === referenceRows.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addReferenceRow}
                        className="border w- border-black btn-md d-flex mt-2 justify-content-center align-items-center square"
                      >
                        <BiPlus />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <h3 className="fw-bold mt-3">Financial Information</h3>
              <div className="row">
                {FinancialFieldConfig.map((field, index) => (
                  <div className="col-md-4" key={index + field.name}>
                    <DynamicFields
                      id={field.name}
                      label={field.label}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      options={field.options}
                      className={field.className}
                      onFileChange={(files, name) => {
                        if (files && files.length > 0) {
                          setFieldValue(name, files[0]);
                        } else {
                          setFieldValue(name, null);
                        }
                      }}
                      key={index}
                      dropBox={field.dropBox}
                    />
                  </div>
                ))}
              </div>
              <div className="text-end">
                <Button
                  type="submit"
                  className="btn text-dark  border-0 button w-25 shadow-none"
                >
                  Submit
                </Button>
              </div>
              <TermsAndConditions
                show={showTermsModal}
                onHide={() => setShowTermsModal(false)}
                handleClose={() => setShowTermsModal(false)}
                setShowAcceptModal={setShowAcceptModal}
                formData={formData}
              />
              <AcceptModal
                show={showAcceptModal}
                onHide={() => setShowAcceptModal(false)}
              />
              <Disclaimer show={modalShow} onHide={() => setModalShow(false)} />
            </Form>
          )}
        </Formik>
      </div>
      <Footer />
    </>
  );
};

export default ApplicationForm;
