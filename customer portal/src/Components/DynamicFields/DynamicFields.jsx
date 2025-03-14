import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import { useDropzone } from "react-dropzone";
import { Field, ErrorMessage } from "formik";
import { FaCalendarAlt } from "react-icons/fa";

const DynamicFields = ({
  id,
  label,
  type,
  name,
  placeholder,
  options,
  className,
  onFileChange,
  dropBox,
  setFieldValue,
  handleBlur,
  handleChange,
  values,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const maxSize = 1 * 1024 * 1024;

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    maxSize,
    onDropAccepted: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImagePreview(URL.createObjectURL(file));
      onFileChange(acceptedFiles, name);
    },
    onDropRejected: (rejectedFiles) => {
      const errorMessages = [];

      rejectedFiles.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          if (error.code === "file-too-large") {
            errorMessages.push(
              `File ${rejection.file.name} exceeds the max size of ${
                maxSize / (1 * 1024 * 1024)
              } MB.`
            );
          } else if (error.code === "file-invalid-type") {
            errorMessages.push(
              `File ${rejection.file.name} has an invalid type.`
            );
          } else {
            errorMessages.push(
              `File ${rejection.file.name} error: ${error.message}`
            );
          }
        });
      });

      if (errorMessages.length > 0) {
        toast.error(errorMessages.join("\n"));
      }
    },
  });

  const clearImage = () => {
    setImagePreview(null);
    onFileChange([], name);
  };
  const handleDateBlur = (e, setFieldValue, key) => {
    console.log("event", e);
    const rawValue = e.target.value.replace(/\D/g, "");
  };

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>
      {type === "date" ? (
        <div className="">
          <div
            style={{
              position: "relative",
              display: "inline-block",
              width: "100%",
            }}
          >
            <DatePicker
              id={name}
              className="form-control"
              selected={values[name] ? new Date(values[name]) : null} 
              onChange={(date) => setFieldValue(name, date)}
              onFocus={(e) => {
                if (!e.target.value) {
                  e.target.value = "dd/mm/yyyy";
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              showYearDropdown
              scrollableYearDropdown
              autoComplete="off"
              onBlur={handleBlur}
              name={name}
              maxDate={new Date()}
              showMonthDropdown
              dropdownMode="select"
              wrapperClassName="w-100"
            />
            <FaCalendarAlt
              style={{
                position: "absolute",
                top: "13px",
                right: "10px",
                pointerEvents: "none",
                color: "gray",
              }}
            />
          </div>
        </div>
      ) : dropBox && type === "image" ? (
        <div
          {...getRootProps()}
          className="dropzone rounded text-center"
          style={{
            minHeight: "150px",
            cursor: "pointer",
            position: "relative",
            border: "3px dotted #c4d8e6",
          }}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <div className="position-relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="img-fluid rounded"
                style={{
                  height: "250px",
                  maxHeight: "220px",
                  objectFit: "cover",
                }}
              />
              <button
                type="button"
                className="btn btn-link text-light bg-danger p-1 position-absolute top-0 end-0"
                onClick={clearImage}
                title="Remove image"
                style={{
                  fontSize: "1rem",
                  lineHeight: 1,
                  padding: 0,
                  border: "none",
                  background: "none",
                }}
              >
                <ImCross />
              </button>
            </div>
          ) : (
            <div className="p-4">
              <h4>Choose File</h4>
              <div className="mb-3 text-muted">
                <span>Drag & Drop the file here</span>
                <p>JPG, PNG, JPEG</p>
              </div>
              <h5>Upload</h5>
              <p>Max Size: 1MB</p>
            </div>
          )}
        </div>
      ) : type === "select" ? (
        <Field as="select" id={id} name={name} className={className}>
          <option value="">Select</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </Field>
      ) : type === "file" || type === "image" ? (
        <input
          id={id}
          name={name}
          type="file"
          accept=".jpg,.jpeg,.png"
          className={className}
          onChange={(event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
              const file = files[0];
              const fileType = file.type;
              const validTypes = ["image/jpeg", "image/png", "image/jpg"];
              if (!validTypes.includes(fileType)) {
                toast.error("Only JPG, JPEG, and PNG files are allowed.");
                event.target.value = "";
                return;
              }
              if (file.size > 1048576) {
                toast.error("File size must be less than 1MB.");
                event.target.value = "";
                return;
              }
              setImagePreview(URL.createObjectURL(file));
              onFileChange(files, name);
            }
          }}
        />
      ) : (
        <Field
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={className}
        />
      )}
      <ErrorMessage
        name={name}
        component="div"
        className="text-danger small ps-1"
      />
    </div>
  );
};

export default DynamicFields;
