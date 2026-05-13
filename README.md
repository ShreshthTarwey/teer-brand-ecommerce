# Teer Brand - Premium Spices E-Commerce Platform 

Teer Brand is a scalable, full-stack e-commerce application designed for a local spices company. Built using the **MERN Stack** (MongoDB, Express, React, Node.js), it provides a premium shopping experience with features like JWT authentication, Razorpay payment integration, a dynamic admin dashboard, and modern UI animations.

**Live Demo:** [https://teerbrand.vercel.app/](https://teerbrand.vercel.app/)

---

## 🛠️ Tech Stack

This project uses the following technologies:

### **Frontend**
*   **React.js**: Functional components with Hooks (`useState`, `useEffect`, `useContext`, etc.).
*   **Redux / Context API**: For global state management (Cart, User Auth).
*   **Framer Motion**: For smooth, high-performance animations (Falling elements, Fade-ins).
*   **CSS / Styled Components**: Custom responsive design with premium aesthetics (Glassmorphism).
*   **Axios**: For handling HTTP requests to the backend.

### **Backend**
*   **Node.js**: Runtime environment.
*   **Express.js**: RESTful API framework.
*   **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM).
*   **JWT (JSON Web Tokens)**: Secure user authentication and authorization.
*   **Bcrypt.js**: Password hashing and security.

### **Integrations**
*   **Razorpay**: Secure Payment Gateway integration.
*   **EmailJS / Nodemailer**: For sending order confirmations or OTPs.
*   **Recharts**: For Admin Dashboard analytics.

---

## ✨ Features

### **User Features**
*   **Authentication**: Secure Login, Registration, and Password Recovery.
*   **Product Gallery**: Browse products with dynamic filtering, searching, and sorting.
*   **Interactive UI**:
    *   *Hero Animation*: Falling spices effect using Framer Motion.
    *   *Aroma Animation*: Rising smoke/aroma effect in the Online Store.
    *   *Parallax Effects*: Mouse-reactive backgrounds in "Contact Us".
*   **Shopping Cart**: Hybrid cart system (MongoDB for logged-in users, LocalStorage for guests).
*   **Secure Checkout**: Integration with Razorpay for real payment processing.
*   **Order History**: Users can track their past orders and statuses.
*   **Reviews**: Verified purchasers can leave star ratings and comments.

### **Admin Features**
*   **Dashboard Overview**: Visual analytics for Total Sales, Orders, and Top Products using Charts.
*   **Product Management**: CRUD (Create, Read, Update, Delete) operations for inventory.
*   **Order Management**: View and update order statuses (Pending -> Delivered).
*   **Reports**: Downloadable CSV reports for sales analysis.
*   **Instant Updates**: Optimistic UI updates for stock management.

---

## 📂 Folder Structure

The project follows a modular MERN stack architecture, upgraded for DevOps readiness with Docker and CI/CD pipelines.

```text
Teer_Brand_MERN/
├── .github/                  # GitHub Actions CI/CD workflows
│   └── workflows/            # Pipeline definitions (build, test, deploy)
├── client/                   # Frontend React Application (Vite)
│   ├── public/               # Static assets directly served to the browser
│   ├── src/                  # Main frontend source code
│   │   ├── assets/           # Images, fonts, and local media
│   │   ├── components/       # Reusable React components (UI elements)
│   │   ├── context/          # React Context API for global state (Auth, Cart)
│   │   ├── hooks/            # Custom React hooks for shared logic
│   │   ├── pages/            # Top-level page components (Home, Shop, Admin)
│   │   └── services/         # API call modules to communicate with backend
│   ├── .env.example          # Example environment variables for frontend
│   └── package.json          # Frontend dependencies and scripts
├── server/                   # Backend Node.js & Express Application
│   ├── config/               # Database and third-party API configurations
│   ├── controllers/          # Core business logic for API endpoints
│   ├── middleware/           # Custom middleware (JWT Auth, Error handling)
│   ├── models/               # Mongoose database schemas (MongoDB Atlas)
│   ├── routes/               # Express API route definitions
│   ├── utils/                # Helper functions (Hash passwords, generate tokens)
│   ├── server.js             # Backend application entry point
│   ├── Dockerfile            # Optimized Docker configuration for the backend
│   ├── .dockerignore         # Specifies files to exclude from Docker build
│   ├── .env.example          # Example environment variables for backend
│   └── package.json          # Backend dependencies and scripts
├── Jenkinsfile               # Jenkins deployment pipeline configuration
├── nginx/                    # Nginx configurations for reverse proxy (Production)
├── docker-compose.yml        # Orchestration for multi-container execution
└── README.md                 # Project documentation (this file)
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### **Prerequisites**
*   Node.js installed
*   MongoDB installed or URI for Atlas

### **Installation**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ShreshthTarwey/Teer_Brand.git
    cd Teer_Brand
    ```

2.  **Server Setup:**
    ```bash
    cd server
    npm install
    ```
    *   Create a `.env` file in the `server` directory and add:
        ```env
        MONGO_URL=your_mongodb_connection_string
        JWT_SEC=your_jwt_secret
        PASS_SEC=your_password_secret
        RAZORPAY_KEY_ID=your_razorpay_key
        RAZORPAY_KEY_SECRET=your_razorpay_secret
        ```
    *   Start the server:
        ```bash
        npm start
        ```

3.  **Client Setup:**
    ```bash
    cd ../client
    npm install
    ```
    *   Start the frontend:
        ```bash
        npm run dev
        ```

4.  **Visit the App:**
    Open `http://localhost:5173` in your browser.

---

## 📄 License
This project is for educational and portfolio purposes.

---
*Developed by [Shreshth Tarwey](https://github.com/ShreshthTarwey)*
