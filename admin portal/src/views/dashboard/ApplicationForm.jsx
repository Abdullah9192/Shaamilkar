import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import DynamicFields from '../../components/DynamicFields'
import * as Yup from 'yup'
import { BiPlus, BiTrash } from 'react-icons/bi'
import { FaDropbox } from 'react-icons/fa6'

const ApplicationForm = () => {
  const [referenceRows, setReferenceRows] = useState([{}]) // Start with one empty reference row

  const initialValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    fatherName: '',
    husbandName: '',
    gender: '',
    dob: '',
    mobileNumber: '',
    cNIC: '',
    cityPersonal: '',
    currentAddress: '',
    livingSince: '',
    residenceType: '',
    jobDescription: '',
    occupation: '',
    occupationStatus: '',
    organizationName: '',
    organizationAddress: '',
    workingSince: '',
    officeAddress: '',
    officeNumber: '',
    cnicFrontPhoto: '',
    cnicBackPhoto: '',
    sixMonthBankStatement: '',
    lastSallerySlip: '',
    utilityBill: '',
    references: [
      {
        referenceFullName: '',
        referenceCnic: '',
        referenceContactNumber: '',
        referenceRelation: ''
      }
    ],
    incomePerMonth: ''
  }
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    middleName: Yup.string(),
    lastName: Yup.string().required('Last Name is required'),
    fatherName: Yup.string(),
    husbandName: Yup.string(),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date().required('Date of Birth is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    cNIC: Yup.string().required('CNIC is required'),
    cityPersonal: Yup.string()
      .required('City is required')
      .oneOf(['lahore', 'Other City'], 'Invalid city selected'),
    currentAddress: Yup.string().required('Current Address is required'),
    livingSince: Yup.string().required('Living Since is required'),
    residenceType: Yup.string().required('Residence Type is required'),
    jobDescription: Yup.string().required('Job Description is required'),
    occupation: Yup.string().required('Occupation is required'),
    occupationStatus: Yup.string().required('Occupation Status is required'),
    organizationAddress: Yup.string().required(
      'Organization Address is required'
    ),
    workingSince: Yup.string().required('Working Since is required'),
    officeAddress: Yup.string().required('Office Address is required'),
    incomePerMonth: Yup.string().required('Income Per Month is required'),
    cnicFrontPhoto: Yup.mixed()
      .required('CNIC Front Photo is required')
      .nullable(),
    cnicBackPhoto: Yup.mixed().required('CNIC Back Photo is required'),
    sixMonthBankStatement: Yup.mixed().required('Bank Statement is required'),
    lastSallerySlip: Yup.mixed().required('Salary Slip is required'),
    utilityBill: Yup.mixed().required('Utility Bill is required'),

    references: Yup.array().of(
      Yup.object().shape({
        referenceFullName: Yup.string().required('Full Name is required'),
        referenceCnic: Yup.string().required('CNIC is required'),
        referenceContactNumber: Yup.string().required('Phone is required'),
        referenceRelation: Yup.string().required('Relation is required')
      })
    )
  }).test(
    'father-or-husband-name',
    'Either Father Name or Husband Name is required',
    function (values) {
      return !!values.fatherName || !!values.husbandName
    }
  )

  const handleSubmit = (values, { resetForm }) => {
    console.log(values)
    try {
      // Save form data to localStorage
      localStorage.setItem('applicationFormData', JSON.stringify(values))
      console.log('Form data saved to localStorage:', values)
      alert('Form data saved successfully!')
      resetForm()
    } catch (error) {
      console.error('Error saving form data:', error)
      alert('Error saving form data. Please try again.')
    }
  }
  const handleFileChange = (event, name) => {
    const file = event.target.files[0]
    console.log(`File selected for ${name}:`, file)
  }
  const personalFieldsConfig = [
    {
      label: 'First Name',
      id: 'firstName',
      name: 'firstName',
      type: 'text',
      placeholder: 'First Name',
      className: 'form-control'
    },
    {
      label: 'Middle Name',
      id: 'middleName',
      name: 'middleName',
      type: 'text',
      placeholder: 'Middle Name',
      className: 'form-control'
    },
    {
      label: 'Last Name',
      id: 'lastName',
      name: 'lastName',
      type: 'text',
      placeholder: 'Last Name',
      className: 'form-control'
    },
    {
      label: 'Father Name',
      id: 'fatherName',
      name: 'fatherName',
      type: 'text',
      placeholder: 'Father Name',
      className: 'form-control'
    },
    {
      label: 'Husband Name',
      id: 'husbandName',
      name: 'husbandName',
      type: 'text',
      placeholder: 'Husband Name',
      className: 'form-control'
    },
    {
      label: 'Gender',
      id: 'gender',
      name: 'gender',
      type: 'select',
      placeholder: 'Gender',
      className: 'form-select',
      options: ['Male', 'Female']
    },
    {
      label: 'Date of Birth',
      id: 'dob',
      name: 'dob',
      type: 'Date',
      placeholder: 'Date',
      className: 'form-control'
    },
    {
      label: 'Mobile Number',
      id: 'mobileNumber',
      name: 'mobileNumber',
      type: 'text',
      placeholder: 'Mobile Number',
      className: 'form-control'
    },
    {
      label: 'CNIC',
      id: 'cNIC',
      name: 'cNIC',
      type: 'text',
      placeholder: 'CNIC Number',
      className: 'form-control'
    },
    {
      label: 'Cnic Front Photo',
      id: 'cnicFrontPhoto',
      name: 'cnicFrontPhoto',
      type: 'image',
      className: 'form-control'
    },
    {
      label: 'Cnic back Photo',
      id: 'cnicBackPhoto',
      name: 'cnicBackPhoto',
      type: 'image',
      className: 'form-control'
    },
    {
      label: 'Email Address',
      id: 'email',
      name: 'email',
      type: 'email',
      placeholder: 'Email Address',
      className: 'form-control'
    },
    {
      label: 'Current Address',
      id: 'currentAddress',
      name: 'currentAddress',
      type: 'text',
      placeholder: 'Current Address',
      className: 'form-control'
    },
    {
      label: 'City',
      id: 'cityPersonal',
      name: 'cityPersonal',
      type: 'text',
      placeholder: 'City',
      className: 'form-control'
    },
    {
      label: 'Living Since',
      id: 'livingSince',
      name: 'livingSince',
      type: 'select',
      options: [
        '2000',
        '2001',
        '2002',
        '2003',
        '2004',
        '2005',
        '2006',
        '2007',
        '2008',
        '2009',
        '2010',
        '2011',
        '2012'
      ],
      className: 'form-select'
    },
    {
      label: 'Residence Type',
      id: 'residenceType',
      name: 'residenceType',
      type: 'select',
      options: ['Rented', 'Owened'],
      className: 'form-select'
    }
  ]
  const FieldsConfig = [
    {
      label: 'Job Description/Title',
      id: 'jobDescription',
      name: 'jobDescription',
      type: 'text',
      placeholder: 'Job Description/Title',
      className: 'form-control'
    },
    {
      label: 'Occupation',
      id: 'occupation',
      name: 'occupation',
      type: 'select',
      options: ['Self Employed', 'Employed', 'Unemployed'],
      className: 'form-select'
    },
    {
      label: 'Occupation Status',
      id: 'occupationStatus',
      name: 'occupationStatus',
      type: 'text',
      placeholder: 'Occupation Status',
      className: 'form-control'
    },
    {
      label: 'Organization Name',
      id: 'organizationName',
      name: 'organizationName',
      type: 'text',
      placeholder: 'Organization Name',
      className: 'form-control'
    },
    {
      label: 'Organization Address',
      id: 'organizationAddress',
      name: 'organizationAddress',
      type: 'text',
      placeholder: 'Organization Address',
      className: 'form-control'
    },
    {
      label: 'Working Since',
      id: 'workingSince',
      name: 'workingSince',
      type: 'select',
      placeholder: 'Working Since',
      className: 'form-select',
      options: [
        '1999',
        '2000',
        '2001',
        '2002',
        '2003',
        '2004',
        '2005',
        '2006',
        '2007',
        '2008',
        '2009',
        '2010',
        '2011',
        '2012',
        '2013',
        '2014',
        '2015',
        '2016',
        '2017',
        '2018',
        '2019',
        '2020',
        '2021',
        '2022',
        '2023',
        '2024',
        '2025'
      ]
    },
    {
      label: 'Office Address',
      id: 'officeAddress',
      name: 'officeAddress',
      type: 'text',
      placeholder: 'Office Address',
      className: 'form-control'
    },
    {
      label: 'Office Number',
      id: 'officeNumber',
      name: 'officeNumber',
      type: 'text',
      placeholder: 'Office Number',
      className: 'form-control'
    },
    {
      label: 'Income Per Month',
      id: 'incomePerMonth',
      name: 'incomePerMonth',
      type: 'number',
      placeholder: 'Income Per Month',
      className: 'form-control'
    }
  ]
  const RefferenceFieldConfig = [
    {
      name: 'referenceFullName',
      label: 'Full Name',
      placeholder: 'Full Name',
      className: 'form-control',
      type: 'text'
    },
    {
      name: 'referenceCnic',
      label: 'CNIC',
      placeholder: 'CNIC (xxxxx-xxxxxxx-x)',
      className: 'form-control',
      type: 'text'
    },
    {
      name: 'referenceContactNumber',
      className: 'form-control',
      label: 'Contact Number',
      placeholder: 'Contact Number',
      type: 'text'
    },
    {
      name: 'referenceRelation',
      className: 'form-control',
      label: 'Relation',
      placeholder: 'Relation',
      type: 'text'
    }
  ]
  const FinancialFieldConfig = [
    {
      name: 'sixMonthBankStatement',
      label: '6 Month Bank Statement',
      placeholder: '6 Month Bank Statement',
      type: 'image',
      className: 'form-control',
      dropBox: true
    },
    {
      name: 'lastSallerySlip',
      label: 'Last Salary Slip',
      placeholder: 'Last Salary Slip',
      type: 'image',
      className: 'form-control',
      dropBox: true
    },
    {
      name: 'utilityBill',
      label: 'Utility Bill',
      placeholder: 'Utility Bill',
      type: 'image',
      className: 'form-control',
      dropBox: true
    }
  ]
  const addReferenceRow = () => {
    setReferenceRows([...referenceRows, {}])
  }
  const deleteReferenceRow = (index) => {
    const updatedRows = referenceRows.filter((_, i) => i !== index)
    setReferenceRows(updatedRows)
  }
  return (
    <div>
      <h3>Application Form</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <h4>Personal Information</h4>
            <div className="row">
              {personalFieldsConfig.map((field, index) => (
                <div className="col-md-3" key={index + field.name}>
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
                        // Set Formik field value
                        setFieldValue(name, files[0])
                      } else {
                        setFieldValue(name, null) // Clear the field value
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <h4>Work /Employement Information</h4>
            <div className="row">
              {FieldsConfig.map((field, index) => (
                <div className="col-md-3" key={index + field.name}>
                  <DynamicFields
                    id={field.name}
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    options={field.options}
                    className={field.className}
                    onFileChange={handleFileChange}
                    key={index}
                  />
                </div>
              ))}
            </div>
            <h4>Reference Information</h4>
            {referenceRows.map((_, index) => (
              <div className="d-flex gap-2 align-items-end" key={index + _}>
                <div
                  key={index}
                  className="row w-100"
                  style={{ weidth: '100%' }}
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
                        name={`references[${index}].${field.name}`}
                        placeholder={field.placeholder}
                        className={field.className}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => deleteReferenceRow(index)}
                  className="btn border border-danger text-danger btn-sm mb-4 d-flex justify-content-center align-items-center square"
                >
                  <BiTrash />
                </Button>
                {index === referenceRows.length - 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addReferenceRow}
                    className="border border-black btn-sm mb-4 d-flex justify-content-center align-items-center square"
                  >
                    <BiPlus />
                  </Button>
                )}
              </div>
            ))}
            <h4>Financial Information</h4>
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
                        setFieldValue(name, files[0])
                      } else {
                        setFieldValue(name, null)
                      }
                    }}
                    key={index}
                    dropBox={field.dropBox}
                  />
                </div>
              ))}
            </div>
            {/* Button to add a new row */}
            <div className="text-end">
              <Button type="submit" className="btn btn-success btn-lg w-25">
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ApplicationForm
