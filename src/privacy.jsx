import React from "react";
import { Link } from "react-router-dom";
import "./privacy.css";

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: "20px" }}>
      <p>
        <Link to="/dashboard" style={{ color: "#007185" }}>
          ← Back to Dashboard
        </Link>
      </p>
<div className="privacy-container" >
      <h2>Privacy Policy</h2>
      <p><strong>Privacy Policy for Student Attendance System Using Fingerprint Recognition</strong></p>
      <p><strong>Effective Date:</strong> 12-04-2025</p>

      <ol>
        <li><strong>Introduction:</strong> We are dedicated to protecting the privacy of all users. This Privacy Policy describes how we collect, use, and protect your data.</li>
        <li><strong>Data Collection:</strong> We collect fingerprint data solely for verifying attendance. No additional personal information is gathered without explicit consent.</li>
        <li><strong>Data Usage:</strong> The fingerprint data collected will be used exclusively for attendance tracking and reporting.</li>
        <li><strong>Data Sharing:</strong> We do not share fingerprint data with third parties unless required by law or with prior consent.</li>
        <li><strong>Data Security:</strong> All fingerprint data is encrypted and stored securely, with access limited to authorized personnel only.</li>
        <li><strong>Data Retention:</strong> Fingerprint data will be retained only for as long as necessary for the intended purpose or required by law.</li>
        <li><strong>Your Rights:</strong> You have the right to access, update, or delete your personal data at any time. Contact us for assistance.</li>
        <li><strong>Consent:</strong> By using this system, you consent to the collection and use of your fingerprint data as outlined in this policy.</li>
        <li><strong>Policy Updates:</strong> We may update this Privacy Policy periodically. Changes will be communicated through appropriate channels.</li>
        <li><strong>Contact Information:</strong> If you have questions, reach out to [Insert Contact Information].</li>
        <li><strong>Cookies and Tracking:</strong> We do not use cookies or tracking technologies to collect additional data.</li>
        <li><strong>Third-Party Integrations:</strong> The system does not integrate with third-party services that may collect personal data.</li>
        <li><strong>User Responsibility:</strong> Users are responsible for ensuring their credentials and devices are secure.</li>
        <li><strong>Data Breach Response:</strong> In the event of a data breach, affected users will be notified promptly, and necessary actions will be taken.</li>
        <li><strong>International Users:</strong> This system complies with data protection regulations applicable in [Insert Region].</li>
        <li><strong>Children’s Privacy:</strong> Special care is taken to protect the data of underage users as per legal requirements.</li>
        <li><strong>Opt-Out:</strong> Users may choose to opt-out of fingerprint-based attendance by contacting the administrator.</li>
        <li><strong>Accuracy of Data:</strong> Users must ensure their fingerprint data is accurate for proper system functioning.</li>
        <li><strong>Data Transfer:</strong> If the system is transferred to another organization, users will be informed, and their rights respected.</li>
        <li><strong>Legal Basis:</strong> The processing of fingerprint data is based on legitimate educational interests and consent.</li>
      </ol>

      <p>By using this system, you confirm that you understand and agree to the terms outlined in this Privacy Policy.</p>
    </div>
    </div>
  );
}
