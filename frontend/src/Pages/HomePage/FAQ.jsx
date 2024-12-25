import React from 'react';
import './Page.css';
import BubbleCursor from '../Components/BubbleCursor';

const FAQ = () => {
    return (
        <div className="page">
            <BubbleCursor />
            <div className='top-container'>
                <button onClick={() => window.history.back()}>
                    <img src="/icons/arrow.png" alt="" />
                    Back
                </button>
                <h1>Frequently Asked Questions</h1>
                <p><strong>Last Updated: December 2024</strong></p>
            </div>

            <div className='container'>
                <div className='content'>
                    {/* FAQ Item 1 */}
                    <h3>What is Hustle?</h3>
                    <p>Hustle is a platform that connects clients with skilled service providers for tasks such as home repairs, cleaning, and more.</p>

                    {/* FAQ Item 2 */}
                    <h3>Is it free to sign up?</h3>
                    <p>Yes, users can sign up as a Client or Provider for free.</p>

                    {/* FAQ Item 3 */}
                    <h3>What payment methods are accepted?</h3>
                    <p>We accept major credit/debit cards, GCash, Maya, and other online methods.</p>

                    {/* FAQ Item 4 */}
                    <h3>How are payments handled?</h3>
                    <p>Payments are securely held until the service is marked as completed. Providers receive 95% of the payment, with a 5% platform fee deducted.</p>

                    {/* FAQ Item 5 */}
                    <h3>How can clients book a service?</h3>
                    <p>
                        Clients need to log in, browse or search available services, select a provider, and book a time based on the provider's availability.
                        Clients can also view ratings and reviews before booking.
                    </p>

                    {/* FAQ Item 6 */}
                    <h3>Can clients cancel a service?</h3>
                    <p>Yes, clients can cancel a service request before the provider starts the task.</p>

                    {/* FAQ Item 7 */}
                    <h3>What happens after a service is completed?</h3>
                    <p>
                        After a service is completed, clients can rate and review the provider. Providers receive their payment once the service is marked as completed.
                    </p>

                    {/* FAQ Item 8 */}
                    <h3>How do providers manage their services?</h3>
                    <p>
                        Providers can add, update, and manage their offered services, set their availability, and customize schedules. They can also view client details before accepting a task.
                    </p>

                    {/* FAQ Item 9 */}
                    <h3>Are platform fees applicable?</h3>
                    <p>
                        Yes, for online payments, a 5% platform fee is deducted from the payment, and providers receive 95% once the service is marked as complete.
                        For cash payments, providers must pay a 5% platform fee after the transaction is completed.
                    </p>
                    <h3>Is it possible to cancel a task?</h3>
                    <p>
                        Yes, you can cancel a task instantly, choose a reason for the cancellation, and if you are a Client you will receive a refund if you paid online.
                    </p>
                    <h3>Providers can set their own rates?</h3>
                    <p>Yes, providers can set their rates for each service they offer.</p>
                    <h3>Providers can set availability?</h3>
                    <p>Yes, Providers can set their availability and customize schedules by assigning services to specific dates.</p>
                </div>
                <div className='image-container'>
                    <img src="/icons/faq.png" alt="" />
                </div>
            </div>
        </div>
    );
};

export default FAQ;
