import React from 'react';
import './Page.css';
import BubbleCursor from '../Components/BubbleCursor';

const PrivacyPolicy = () => {
    return (
        <div className="page">
            <BubbleCursor />
            <div className='top-container'>
                <button onClick={() => window.history.back()}>
                    <img src="/icons/arrow.png" alt="" />
                    Back
                    </button>
                <h1>Privacy Policy</h1>
                <p><strong>Last Updated: December 2024</strong></p>
            </div>
        <div className='container'>
        <div className='content'>
        <h3>1. Introduction</h3>
            <p>
                At Hustle, we are committed to protecting your privacy. This Privacy Policy outlines the types of personal information we collect, how we use it, and how we keep it safe. By using our platform, you agree to the collection and use of your information as described in this policy.
            </p>

            <h3>2. Information We Collect</h3>
            <p>
                We collect the following types of information:
                <ul>
                    <li><strong>Personal Information:</strong> When you sign up or use our services, we collect personal details such as your name, email address, phone number, payment information, and other necessary details to facilitate service requests and provide support.</li>
                    <li><strong>Usage Data:</strong> We automatically collect information about how you interact with our platform, such as your IP address, browser type, device information, pages visited, and other usage statistics.</li>
                    <li><strong>Cookies:</strong> We use cookies to enhance your experience on our platform. Cookies help us remember your preferences, keep you logged in, and analyze site traffic. You can manage your cookie preferences through your browser settings.</li>
                </ul>
            </p>

            <h3>3. How We Use Your Information</h3>
            <p>
                We use your information to:
                <ul>
                    <li>Provide and improve our services, including processing payments, facilitating service bookings, and communication between Clients and Providers.</li>
                    <li>Personalize your experience on the platform by offering tailored recommendations and service suggestions.</li>
                    <li>Enhance customer support and respond to inquiries, feedback, or concerns.</li>
                    <li>Analyze usage patterns to improve the performance and functionality of our platform.</li>
                    <li>Send periodic emails regarding your account, service updates, promotions, and other relevant information.</li>
                </ul>
            </p>

            <h3>4. Data Sharing and Disclosure</h3>
            <p>
                We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
                <ul>
                    <li><strong>With Service Providers:</strong> We may share your data with trusted third-party vendors who provide services on our behalf, such as payment processors and email marketing services.</li>
                    <li><strong>For Legal Compliance:</strong> We may disclose your information if required by law or if we believe such action is necessary to comply with legal obligations, protect our rights, or prevent fraud.</li>
                    <li><strong>In Business Transfers:</strong> If we undergo a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
                </ul>
            </p>

            <h3>5. Data Security</h3>
            <p>
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of data transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h3>6. Data Retention</h3>
            <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. If you wish to delete your account or request that we stop processing your data, please contact us using the information provided below.
            </p>

            <h3>7. Your Rights</h3>
            <p>
                Depending on your location, you may have the right to:
                <ul>
                    <li>Access the personal data we hold about you.</li>
                    <li>Request corrections or updates to your personal information.</li>
                    <li>Request deletion of your personal data, subject to certain exceptions.</li>
                    <li>Opt out of marketing communications at any time.</li>
                </ul>
            </p>

            <h3>8. Third-Party Links</h3>
            <p>
                Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
            </p>

            <h3>9. Changes to This Privacy Policy</h3>
            <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Last Updated" at the top will be updated. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>

            <h3>10. Contact Us</h3>
            <p>
                If you have any questions or concerns regarding this Privacy Policy or how we handle your personal data, please contact us at hustle@example.com.
            </p>
        </div>
        <div className='image-container'>
        <img src="/icons/security.avif" alt="" />
        </div>

        </div>
            
        </div>
    );
};

export default PrivacyPolicy;
