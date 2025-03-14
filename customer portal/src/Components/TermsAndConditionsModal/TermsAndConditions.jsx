import React, { useState } from "react";
import "../../App.css";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { BASE_URL } from "../../BASE_URL";
import { toast } from "react-toastify";

const TermsAndConditions = ({
  show,
  onHide,
  handleClose,
  setShowAcceptModal,
  formData,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!show || !formData) return null;
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleAcceptAndSubmit = async () => {
    if (!formData) {
      return;
    }
    const token = localStorage.getItem("accessToken");

    const requestPromise = axios.post(
      `${BASE_URL}/application/createapplication`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.promise(requestPromise, {
      pending: "Submitting your application...",
      success: "Request submitted",
      error: "Failed to submit application. Please try again.",
    });

    try {
      const response = await requestPromise;
      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        setShowAcceptModal(true);
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
    onHide();
  };

  console.log(formData);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        className="px-2"
      >
        <Modal.Header closeButton>
          <Modal.Title padding="20px">Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-scrollbar">
            <p>
              Shaamilkar Financial Services (Private) Limited, is a Non-Banking
              Finance Company licensed by the Securities & Exchange Commission
              of Pakistan, having its registered office at COLABS Cantt NASTP,
              69 Abid Majeed Rd, Lahore Cantt, Pakistan, is the owner of the
              website “www.shaamilkar.com” and herein after shall be referred to
              as “Shaamilkar”. As a user (User) of this Site, the User
              understands that this site is a Shariah compliant digital lending
              platform.
            </p>
            <h5 className="text-dark">Acceptance of Terms and Conditions</h5>
            <p>
              As a User of this Website, you have agreed to the Terms and
              Conditions that Shaamilkar has provided hereunder or anywhere else
              in this Website including but not limited to disclaimers on this
              Website. You are advised to read and understand the said Terms and
              Conditions.
            </p>
            <p>
              Customer data will be stored on the local server with appropriate
              security and all information will be treated as confidential.
              Access will be provided to employees on a need-to-know basis only.
              The information will also be shared with third parties for
              verification and credit assessment.
            </p>
            <p>
              Your use of this Website implies that you have read, understood
              and agreed to abide by following disclaimer and terms &
              conditions. These Terms & Conditions together with our privacy
              policy as provided on the Website govern your usage of the Website
              and by using this website you are willing to abide by the Terms &
              Conditions herein. If you disagree with any part of these terms
              and conditions, please do not use the Website. These terms and
              conditions are however subject to change anytime as and when
              required appropriate by the management of Shaamilkar.
            </p>
            <h5 className="text-dark">Eligibility</h5>
            <p>
              The User of this Website unequivocally declare and agree and that
              the User is a natural / legal person who has attained the age of
              at least 18 years and is legally allowed to enter a contract in
              Pakistan. The User is allowed to utilize the services of the
              Website in accordance with the terms and conditions detailed
              herein and have agreed to become a member of this website. By
              ordering or registering on the Website, the User hereby undertakes
              to agree and abide by the Terms and Conditions detailed
              hereinafter.
            </p>
            <p>
              If the User violates any of these Terms & Conditions, or otherwise
              violate an agreement entered into through the medium of the
              Website, Shaamilkar may terminate the Users membership, delete
              his/her profile and any content or information posted by the User
              on the Website and/or prohibit the User from using or accessing
              the Website at any time in its sole discretion, with or without
              notice, including without limitation if it believes that you are
              under 18.
            </p>
            <h5 className="text-dark">Your Account</h5>
            <p>
              If you use the Website, you are responsible for maintaining the
              confidentiality of your account and password and for restricting
              access to your computer to prevent unauthorized access to your
              account. You agree to accept responsibility for all activities
              that occur under your account or password. You should take all
              necessary steps to ensure that the password is kept confidential
              and secure and should inform us at complaints@Shaamilkar.com
              immediately if you have any reason to believe that your password
              has become known to anyone else, or if the password is being, or
              is likely to be, used in an unauthorized manner. Please ensure
              that the details you provide to us are correct and complete and
              inform us immediately of any changes to the information that you
              provided when registering. You can access and update much of the
              information you provided us with on the Website after you log-in.
              Shaamilkar reserves the right to refuse access to the Website,
              terminate accounts, remove or edit content at any time without
              notice to you. The right to use this Website is personal to the
              User and is not transferable to any other person or entity.
              Shaamilkar shall not be responsible for any data lost while
              transmitting information on the internet.
            </p>
            <p>
              By using this Website as a User, you hereby represent that you are
              of legal age to form a binding contract as per the laws prevalent
              in Pakistan for the time being in force. You hereby also represent
              that you are more than 18 years of age. The User also
              unequivocally agrees to provide true, accurate, current and
              complete information about him as sought by the registration form
              of the Website. Upon Shaamilkar gaining knowledge of having any
              reasonable suspicion that the information provided by you is
              wrong, inaccurate or incorrect, Shaamilkar shall immediately
              terminate your account without any notice to you in this regard.
              You shall always abide by the Terms and Conditions stated herein
              and any breach of these conditions may also lead to Shaamilkar
              terminating your account and/or take appropriate civil and
              criminal remedies against you as provided under the laws of
              Pakistan.
            </p>
            <p>
              In case any personal information is required to be shared with a
              third party as directed and authorized by law or court order or
              any such authority legally allowed to ask for such information,
              Shaamilkar will be at liberty to share such information
            </p>
            <h5 className="text-dark">
              Online Order Placement & Loan Application
            </h5>
            <p>
              A customer may submit the initial information on the application
              form for selected product through this website. Shaamilkar
              requires the following documents to proceed with the orders:
            </p>
            <h6 className="text-dark">Documents Required:</h6>
            <ol className="list-group-numbered list-group">
              <li className="list-group-item">
                A copy of the applicant’s CNIC
              </li>
              <li className="list-group-item">
                Name, mobile number, and relation with the reference person
              </li>
              <li className="list-group-item">
                Customer’s financial information to assess income and
                indebtedness, such as bank statements, pay slips, etc.
              </li>
              <li className="list-group-item">
                Agreement signed by the applicant
              </li>
              <li className="list-group-item">
                Undertaking signed by the applicant
              </li>
              <li className="list-group-item">
                Receipt of Down Payment amount after signing “Musawammah
                Agreement”
              </li>
              <li className="list-group-item">
                Utility Bill Copy (on case-to-case basis)
              </li>
            </ol>

            <h5 className="text-dark">Process Information</h5>
            <ol className="list-group-numbered list-group">
              <li className="list-group-item">
                Shaamilkar reserves the right to reject an application request
                for any reason whatsoever with or without informing the user.
              </li>
              <li className="list-group-item">
                The process will start after submission of all the required
                documents from the applicant.
              </li>
              <li className="list-group-item">
                Product Warranty will be claimed directly from the concerned
                Brand or from its Authorized Service Center according to the
                standard warranty conditions of the Brand.
              </li>
              <li className="list-group-item">
                In case an item supplied is not working after the delivery,
                customers must inform directly to the manufacturer within 48
                hours of delivery and inform our team as well.
              </li>
              <li className="list-group-item">
                Shaamilkar reserves the right to change availability and prices
                as and when necessary, with/without notice. But once the product
                deal is locked, your amount will not change based on market
                fluctuation of prices.
              </li>
              <li className="list-group-item">
                Product pictures and contents displayed on the foregoing pages
                are provided for reference only.
              </li>
              <li className="list-group-item">
                Shaamilkar maintains a prudent market information on product
                availability but again product availability will be dependent
                upon market conditions.
              </li>
              <li className="list-group-item">
                Product delivery is dependent on the vendor’s lead time and
                actual delivery time may vary.
              </li>
              <li className="list-group-item">
                All data in the foregoing pages are theoretical values obtained
                by Shaamilkar. For more information, refer to the product
                details on the vendor website. Actual data may vary owing to
                differences in individual products, software versions,
                application conditions, and environmental factors.
              </li>
              <li className="list-group-item">
                Shaamilkar may use services of credit risk assessment providers
                to conduct risk assessment on the Users to determine credit
                history and analyze whether Shaamilkar can approve the
                application or not.
              </li>
              <li className="list-group-item">
                Shaamilkar will report your profile to the e-CIB in case of a
                default and after allowing you to amicably settle your
                outstanding dues.
              </li>
              <li className="list-group-item">
                Shaamilkar will enroll smartphones and tablets for smart locking
                which may end up locking in the event of default of installment.
                This does not apply to any application on the device
                (smartphone/tablet). Shaamilkar does not install any application
                on the device to pull any personal information of the customer.
              </li>
            </ol>
            <h5 className="text-dark">Cooling-of period</h5>
            <p>
              Orders placed by a customer may be withdrawn at any time before
              the signing of the agreement.
            </p>
            <div>
              <h5 className="text-dark">Monitoring and Content Regulation</h5>
              <p>
                Shaamilkar has the right and liberty to always monitor the
                content of the Website which shall include information provided
                in your account. The monitoring of the Website is important to
                determine the veracity of the information provided by you and
                that every User remains in consonance with the Terms and
                Conditions provided herein. Subject to the Terms and Conditions
                mentioned herein, Shaamilkar shall also have the liberty to
                remove any objectionable content which is in contravention of
                the Terms and Conditions herein or share such information with
                any governmental authority as per procedures laid down by the
                law for the time being in force in Pakistan.
              </p>

              <h5 className="text-dark">License and Site Access</h5>
              <p>
                Shaamilkar grants you a limited license to access and make
                personal use of the Website, but not to download (other than
                page caching) or modify it, or any portion of it, except with
                express written consent of Shaamilkar and/or its affiliates, as
                may be applicable. This license does not include any resale or
                commercial use of this Website or its contents; any downloading
                or copying of account information for the benefit of anyone
                other than your use; or any use of data mining, robots, or
                similar data gathering and extraction tools. This Website or any
                portion of this Website (including but not limited to any
                copyrighted material, trademarks, or other proprietary
                information) may not be reproduced, duplicated, copied, sold,
                resold, visited, distributed or otherwise exploited for any
                commercial purpose without express written consent of Shaamilkar
                and/or its affiliates, as may be applicable. Any unauthorized
                use of the Website shall terminate the permission or license
                granted by Shaamilkar.
              </p>

              <p>
                Notwithstanding anything to the contrary contained herein,
                neither Shaamilkar nor its affiliated companies, subsidiaries,
                officers, directors, employees, or any related party shall have
                any liability to you or to any third party for any indirect,
                incidental, special, or consequential damages or any loss of
                revenue or profits arising under or relating to these terms and
                conditions. To the maximum extent permitted by law, you waive,
                release, discharge, and hold harmless Shaamilkar, its affiliated
                and subsidiary companies, and each of their directors, officers,
                employees, and agents, from all claims, losses, damages,
                liabilities, expenses, and causes of action arising out of your
                use of the Website.
              </p>

              <p>
                The User is entitled to conduct his/her own diligence before
                taking any steps to initiate the processes outlined on the
                Website, including placing an order.
              </p>

              <p>
                Shaamilkar makes no representations or warranties about the
                accuracy, reliability, completeness, current-ness, and/or
                timeliness of any content, information, software, text,
                graphics, links, or communications provided on or using the Site
                or that the operation of the Site will be error-free and/or
                uninterrupted. Consequently, Shaamilkar assumes no liability
                whatsoever for any monetary or other damage suffered by you on
                account of the delay, failure, interruption, or corruption of
                any data or other information transmitted in connection with use
                of the Site; and/or any interruption or errors in the operation
                of the Website. This limitation of liability clause shall
                prevail over any conflicting or inconsistent provision contained
                in any of the documents comprising the agreement. It is up to
                you to take precautions to ensure that whatever you select for
                your use is free of such items as viruses, worms, trojan horses,
                and other items of a destructive nature.
              </p>

              <p>
                Users are also encouraged to check the market prices and do
                their due diligence before entering a purchase decision.
                Information on websites is subject to change without notice, and
                users will be informed of any change in price or product
                availability before customer agreement.
              </p>

              <h5 className="text-dark">Indemnity</h5>
              <p>
                You agree to indemnify, save, and hold Shaamilkar, its
                affiliates, contractors, employees, officers, directors, agents,
                and its third-party associates, licensors, and partners harmless
                from any and all claims, losses, damages, and liabilities, costs
                and expenses, including without limitation legal fees and
                expenses, arising out of or related to your use or misuse of the
                services or of the Website, any violation by you of this
                Agreement, or any breach of the representations, warranties, and
                covenants made by you herein. Shaamilkar reserves the right, at
                your expense, to assume the exclusive defense and control of any
                matter for which you are required to indemnify Shaamilkar,
                including rights to settle, and you agree to cooperate with
                Shaamilkar for its defense and settlement of these claims.
                Shaamilkar will use reasonable efforts to notify you of any
                claim, action, or proceeding brought by a third party that is
                subject to the foregoing indemnification upon becoming aware of
                it. This paragraph shall survive termination of this Agreement.
              </p>
            </div>
            <div>
              <h5 className="text-dark">Acknowledgements</h5>
              <p>
                This website provides access to facilitate purchase on
                installments. You acknowledge that the fulfillment of an order
                is entirely digital using third-party income verification and
                credit assessment by Shaamilkar. Shaamilkar in no manner
                warrants or guarantees the performance of a service provider
                that is providing services through the Website.
                <strong>
                  You acknowledge that Shaamilkar in no manner guarantees that
                  the lender or the borrower has provided all the information on
                  this Website, which is true and correct including his address,
                  phone numbers etc. You acknowledge that it is your
                  responsibility to verify the information about the person on
                  the Website and Shaamilkar is in no manner liable if the
                  information provided on this Website is untrue or incorrect.
                  You acknowledge that Shaamilkar is in no manner responsible
                  for any claim of money or damages in the event one entity
                  fails to either grant a loan or a person fails to repay the
                  loan or misrepresents his financial status or commits a fraud
                  or cheating or any other such illegal act.
                </strong>
                You acknowledge that Shaamilkar in no manner guarantees the
                performance of the product acquired by you through the financing
                of Shaamilkar and no claim whatsoever shall be admissible.
              </p>

              <h5 className="text-dark">Applicable Laws</h5>
              <p>
                Your use of this Site and any Terms and Conditions stated in
                this policy is subject to the laws of Pakistan. In case of any
                disputes arising out of the use of the Website, Courts of
                Pakistan will have exclusive jurisdiction.
              </p>

              <h5 className="text-dark">Currency</h5>
              <p>All prices will be made in Pakistani Rupees (PKR).</p>
            </div>
            <div>
              <h5 className="text-dark text-decoration-underline">
                Customer Protection Mechanism
              </h5>
              <p>
                Besides its own interests, the company shall have in place a
                mechanism for the protection of its customers. Its salient
                features are as under:
              </p>
              <ol className="list-group">
                <li className="list-group-item">
                  The company shall ensure fair treatment of borrowers and
                  prohibit unfair practices and breach of confidentiality of
                  personal information of the borrowers.
                </li>
                <li className="list-group-item">
                  The company shall disclose and share all the key terms and
                  conditions of the customer agreement (like amount, profit
                  rate/ratio, fees, charges, terms and conditions, etc.) with
                  its borrowers in local/regional language for better
                  understanding. However, in case of financing for the purchase
                  of electronic items and mobile phones or any other consumer
                  goods on an installment basis, including under the Islamic
                  mode, namely Musawamah sale, it is not necessary to disclose
                  the rate of profit. In that case, the total price (including
                  profit) shall be disclosed to the customer, along with down
                  payments and the monthly installments.
                </li>
                <li className="list-group-item">
                  The company shall obtain the borrower’s specific consent on
                  all the key terms prior to the disbursement of any facility.
                </li>
                <li className="list-group-item">
                  The company shall disclose its full corporate name and
                  licensing status on its lending platform(s)/application(s),
                  website, documentation, materials, and advertisements.
                </li>
                <li className="list-group-item">
                  Under <b>NO</b> circumstances will the company engage in
                  harassment or strong-arm tactics in enforcing payments.
                </li>
                <li className="list-group-item">
                  Customers will be provided with an extension of up to two
                  months in case of personal financial hardship.
                </li>
                <li className="list-group-item">
                  In the event a customer is not able to pay after the grace
                  period of two months, the company will initiate legal action
                  for the recovery of the receivable amount as well as for
                  repossessing the product along with litigation costs.
                </li>
                <li className="list-group-item">
                  Customer data will be stored on a local server with
                  appropriate security, and all information will be treated as
                  confidential. Access will be provided to employees on a
                  need-to-know basis only.
                </li>
              </ol>

              <h5 className="text-dark">Grievances</h5>
              <p>
                Users have complete authority to file complaints or share
                feedback if they are disappointed by services rendered by
                Shaamilkar Finance. They can give their complaint/feedback in
                writing or by way of an email to the following:
                <b> complaints@shaamilkar.com</b>
              </p>

              <h5 className="text-dark">Refunds</h5>
              <p>
                In the event a user deposits an amount more than the amount due,
                the excess amount will be adjusted against the next installment.
                If the same happens during the deposit of the final installment,
                the user can contact support at
                <b> complaints@shaamilkar.com </b>
                for a refund of the excess deposit amount. Refunds in such cases
                will be made within 45 days.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              id="termsCheckbox"
              label={
                <label
                  style={{ curser: "pointer" }}
                  htmlFor="termsCheckbox"
                  className="mb-0"
                >
                  I confirm that I have read and accept the terms and
                  conditions.
                </label>
              }
              onChange={handleCheckboxChange}
              checked={isChecked}
              required
            />
          </div>
          <div className="d-flex justify-content-md-end justify-content-end w-100 w-md-auto gap-2 mt-2 mt-md-0">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="success"
              disabled={!isChecked}
              onClick={handleAcceptAndSubmit}
              style={{ width: "130px" }}
            >
              Accept
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TermsAndConditions;
