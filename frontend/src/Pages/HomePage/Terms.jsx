import React from 'react';
import './Page.css';

const TermsOfService = () => {
    return (
        <div className="page">
            <div className='top-container'>
                <button onClick={() => window.history.back()}>
                    <img src="/icons/arrow.png" alt="" />
                    Back
                </button>
            <h1>Terms and Conditions</h1>
            <p><strong>Last Updated: December 2024</strong></p>
            </div>
        <div className='container'>
            <div className='content'>
            <h3>1. Acceptance of Terms</h3>
            <p>
                By using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. We reserve the right to update or modify these Terms at any time, and the changes will be effective immediately upon posting on our platform.
            </p>

            <h3>2. Service Description</h3>
            <p>
                ServiceBridgeSystem is an online platform that connects clients ("Clients") with service providers ("Providers") for various tasks such as home repairs, cleaning, and other related services. Clients can browse, book, and pay for services offered by Providers, while Providers can manage their services and availability.
            </p>

            <h3>3. User Accounts</h3>
            <p>
                To use certain features of the Service, you may need to create an account. You agree to provide accurate and complete information during the registration process and to keep your account information up to date. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <h3>4. Eligibility</h3>
            <p>
                You must be at least 18 years of age to use the Service. By accessing or using the Service, you represent that you are at least 18 years old and are capable of entering into a binding contract.
            </p>

            <h3>5. Payments</h3>
            <p>
                ServiceBridgeSystem supports payments for services through various methods, including credit/debit cards and other online payment systems. By using the Service, you authorize us to process your payments as necessary to complete your transactions.
                <ul>
                    <li><strong>Providers:</strong> You will receive payment after the service is marked as completed. A 5% platform fee will be deducted from your earnings for services paid via online payment systems.</li>
                    <li><strong>Clients:</strong> You agree to pay for services at the rates provided by Providers.</li>
                </ul>
            </p>

            <h3>6. Service Provider Responsibilities</h3>
            <p>
                As a Provider, you agree to:
                <ul>
                    <li>Provide accurate and timely services as per the request of the Client.</li>
                    <li>Maintain a high level of professionalism and follow all relevant regulations for the services provided.</li>
                    <li>Set clear availability and respond promptly to booking requests.</li>
                </ul>
            </p>

            <h3>7. Client Responsibilities</h3>
            <p>
                As a Client, you agree to:
                <ul>
                    <li>Provide accurate details when booking a service.</li>
                    <li>Respect the Provider's time and availability.</li>
                    <li>Make payments for the service as agreed.</li>
                </ul>
            </p>

            <h3>8. Termination of Account</h3>
            <p>
                We reserve the right to suspend or terminate your account at our discretion if you violate these Terms of Service or engage in unlawful activity.
            </p>

            <h3>9. Liability</h3>
            <p>
                ServiceBridgeSystem is not liable for any damages or issues arising from the services provided by Providers or the interactions between Clients and Providers. The platform merely facilitates the connection between Clients and Providers.
            </p>

            <h3>10. Governing Law</h3>
            <p>
                These Terms are governed by and construed in accordance with the laws of [Insert Country/Region]. Any disputes arising out of or relating to these Terms will be subject to the exclusive jurisdiction of the courts of [Insert Jurisdiction].
            </p>

            <h3>11. Contact Us</h3>
            <p>
                If you have any questions or concerns about these Terms, please contact us at [Insert Contact Information].
            </p>
            </div>
            <div className='image-container'>
                <img src="/icons/terms.png" alt="" />
            </div>
        </div>
        </div>
    );
};

export default TermsOfService;
