# Hustle - A Service Bridge System
Hustle is a platform designed to bridge clients and service providers, offering a seamless experience for booking services, handling payments, and managing appointments. It provides a comprehensive suite of features for both clients and providers, allowing them to interact effectively through authentication, service management, and real-time communication.

- ## Features
  #### Client and Provider Authentication
  JWT-based authentication for both clients and providers.
  Secure login and registration processes.
  Protection of sensitive routes based on user roles (Client/Provider).
  
  #### Services List
  List of services offered by platform.
  
  #### Booking and Appointment of Service
  Book services with your preferred provider.
  Schedule appointments based on provider availability.
  
  #### Payment Integration (PayMongo)
  Secure payment processing through PayMongo.
  Support for multiple payment methods including credit card, e-wallet, and bank transfer.
  Automated payment confirmations and receipts.
  
  #### Tracking Transaction Status
  Provider and Client can monitor the status of transactions from booking to service completion.
  
  #### Provider Availability Management
  Provider can set availability for specific dates.
  A provider can choose which service they want to offer on a specific date.
  
  #### Provider Services Offered Management
  Provider can add, update, and remove services offered.
  Provider can set service details, including pricing.
  
  #### Chatting System
  Real-time chat between clients and providers.
  Secure and private communication channel for both parties.

  #### Real Time Notification

  #### Intelligent Chatbot
  Provides instant support and guidance for both clients and providers
  Answers frequently asked questions (FAQs) about payments, bookings, and provider services.

- ## Technologies Used
    - Backend: Node.js, Express.js
    - Database: MySQL (Sequelize ORM)
    - Frontend: React.js
    - Authentication: JWT (JSON Web Tokens)
    - Payment: PayMongo API
    - Real-time Communication: Socket.IO (for chatting system)
    - Gemini AI (for chatbot)
