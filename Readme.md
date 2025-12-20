🚗 Car Rental Management System

A full-stack Car Rental Management System that allows users to browse available cars, make bookings, and manage rentals, while providing owners/admins with control over car listings and bookings.
This project is built to demonstrate real-world full-stack development skills using modern web technologies.

📌 Features
👤 User Features

User registration and login with JWT authentication

Browse available cars

Search cars by pickup location and date

Book cars for selected dates

View personal booking history

Secure logout

🚘 Owner / Admin Features

Add new cars

Update car details

Remove car listings

View all bookings

Owner role-based access

🛠 Tech Stack
Frontend

React.js (Vite)

React Router

Axios

React Context API

React Toastify

CSS / Tailwind CSS (if used)

Backend

Node.js

Express.js

JWT (JSON Web Token) Authentication

Database

MySQL

🔐 Authentication & Authorization

JWT-based authentication

Role-based access control (User / Owner)

Protected routes for authenticated users

Secure API endpoints

📂 Project Structure (Simplified)
Car-Rental-Management-System/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── context/
│   └── pages/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── models/
│
└── README.md

⚙️ Environment Variables
Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_CURRENCY=₹

Backend (.env)
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=car_rental
JWT_SECRET=your_secret_key

🚀 How to Run the Project
1️⃣ Clone the Repository
git clone https://github.com/your-username/car-rental-management-system.git

2️⃣ Backend Setup
cd backend
npm install
npm start

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🧪 API Endpoints (Sample)
Method	Endpoint	Description
POST	/api/user/login	User login
GET	/api/user/data	Get logged-in user
GET	/api/cars	Get all cars
POST	/api/bookings	Create booking

🎯 Learning Outcomes

Full-stack application development

JWT authentication & authorization

RESTful API design

MySQL database integration

React Context for global state management

Real-world project structure

🌱 Future Improvements

Payment gateway integration

Car availability calendar

Admin dashboard analytics

Email notifications

Mobile responsiveness improvements

👩‍💻 Author

Sonali Agarwal
B.Tech (Computer Science) – Central University of Rajasthan

GitHub: https://github.com/Agarwalsonali

LinkedIn: https://www.linkedin.com/in/sonali-agarwal-313b22292

⭐ Acknowledgements

This project was built as part of learning full-stack web development and applying concepts to a real-world use case.