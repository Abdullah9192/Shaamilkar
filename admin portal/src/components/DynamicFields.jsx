import React, { useState } from 'react'
import { Field, ErrorMessage } from 'formik'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { ImCross } from 'react-icons/im'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

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
  readOnly
}) => {
  const [imagePreview, setImagePreview] = useState(null)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const maxSize = 1 * 1024 * 1024 // Maximum file size (1 MB)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': []
    },
    maxSize,
    onDropAccepted: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setImagePreview(URL.createObjectURL(file))
      onFileChange(acceptedFiles, name)
    },
    onDropRejected: (rejectedFiles) => {
      const errorMessages = []

      rejectedFiles.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            errorMessages.push(
              `File ${rejection.file.name} exceeds the maximum allowed size of ${
                maxSize / (1 * 1024 * 1024)
              } MB.`
            )
          } else if (error.code === 'file-invalid-type') {
            errorMessages.push(
              `File ${rejection.file.name} has an invalid file type.`
            )
          } else {
            errorMessages.push(
              `File ${rejection.file.name} encountered an error: ${error.message}`
            )
          }
        })
      })

      if (errorMessages.length > 0) {
        toast.error(errorMessages.join('\n'))
      }
    }
  })

  const clearImage = () => {
    setImagePreview(null)
    onFileChange([], name)
  }
  const formatCNIC = (value) => {
    // Format CNIC as 35202-5457622-1
    value = value.replace(/[^0-9-]/g, '');

    if (!value) return ''
    return value.replace(/^(\d{5})(\d{7})(\d{1})$/, '$1-$2-$3')
  }
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>
      {dropBox && type === 'image' ? (
        <>
          <div
            {...getRootProps()}
            className="dropzone border border-primary rounded text-center"
            style={{
              minHeight: '150px',
              cursor: 'pointer',
              position: 'relative'
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
                    height: '250px',
                    maxHeight: '220px',
                    objectFit: 'cover'
                  }}
                />
                <button
                  type="button"
                  className="btn btn-link text-light bg-danger p-1 position-absolute top-0 end-0"
                  onClick={clearImage}
                  title="Remove image"
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1,
                    padding: 0,
                    border: 'none',
                    background: 'none'
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
        </>
      ) : type === 'select' ? (
        <Field as="select" id={id} name={name} className={className}>
          <option value="">Select {label}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </Field>
      ) : type === 'file' || type === 'image' ? (
        <>
          <input
            id={id}
            name={name}
            type="file"
            accept={type === 'image' ? 'image/*' : undefined}
            className={className}
            onChange={(event) => {
              const files = event.target.files
              if (files && files.length > 0) {
                const file = files[0]
                setImagePreview(URL.createObjectURL(file))
                onFileChange(files, name)
              }
            }}
          />
        </>
      ) : type === 'password' ? (
        <div className="position-relative">
          <Field
            id={id}
            name={name}
            type={passwordVisible ? 'text' : 'password'}
            placeholder={placeholder}
            className={className}
            readOnly={readOnly || false}
          />
          <span
            className="translate-middle-y me-2 cursor-pointer"
            onClick={() => setPasswordVisible(!passwordVisible)}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '10px',
              top: '45%'
            }}
          >
            {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
      ) : (
        <Field
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={className}
          readOnly={readOnly || false}
          onKeyUp={(e) => {
            if (name === 'cnic') {
              e.target.value = formatCNIC(e.target.value) // Format on blur
            }
          }}
        />
      )}

      <ErrorMessage name={name} component="div" className="text-danger small" />
    </div>
  )
}

export default DynamicFields
