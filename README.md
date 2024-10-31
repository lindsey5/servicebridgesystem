# Hustle - A Service Bridge System
Service Bridge System is a platform designed to bridge clients and service providers, offering a seamless experience for booking services, handling payments, and managing appointments. It provides a comprehensive suite of features for both clients and providers, allowing them to interact effectively through authentication, service management, and real-time communication.

- ## Features
  #### Client and Provider Authentication
  JWT-based authentication for both clients and providers.
  Secure login and registration processes.
  Protection of sensitive routes based on user roles (Client/Provider).
  
  #### Services List
  Browse services offered by various providers.
  Filter services based on category or service name.
  Detailed service information including pricing, availability, and reviews.
  
  #### Booking and Appointment of Service
  Book services with your preferred provider.
  Schedule appointments based on provider availability.
  
  #### Payment Integration (PayMongo)
  Secure payment processing through PayMongo.
  Support for multiple payment methods including credit card, e-wallet, and bank transfer.
  Automated payment confirmations and receipts.
  
  #### Tracking Transaction Status
  Monitor ongoing transactions from booking to service completion.
  
  #### Provider Availability Management
  Provider can set availability for specific dates.
  
  #### Provider Services Offered Management
  Add, update, and remove services offered by the provider.
  Set service details, including pricing.
  
  #### Chatting System
  Real-time chat between clients and providers.
  Secure and private communication channel for both parties.

- ## Technologies Used
    - Backend: Node.js, Express.js
    - Database: MySQL (Sequelize ORM)
    - Frontend: React.js
    - Authentication: JWT (JSON Web Tokens)
    - Payment: PayMongo API
    - Real-time Communication: Socket.IO (for chatting system)
