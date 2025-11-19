📄 README.md — Digital Health Platform
🏥 Digital Health Platform (MERN + WebRTC + Socket.io + Admin Panel)

A Telemedicine, Appointment Management & Real-Time Chat System

Live Demo Links

🌐 Frontend (Vercel):
👉 https://health-4ewd9u0i3-euticus-projects.vercel.app

🖥 Backend API (Render):
👉 https://health-jgt3.onrender.com

📘 Project Overview

The Digital Health Platform is a full-stack telemedicine system designed to connect patients, healthcare providers, and administrators in a seamless, real-time digital environment.

The platform empowers users to:

Book appointments

Join real-time video consultations

Chat live using instant messaging

View health analytics

Manage users & roles via an admin dashboard

This project is aligned with UN Sustainable Development Goal (SDG) 3: Good Health & Well-Being, aiming to improve accessibility, efficiency, and affordability in healthcare service delivery.

🚀 Key Features
👨‍⚕️ 1. Role-Based Authentication

Patient

Provider

Administrator

JWT-secured

Automatic role-based redirection

📅 2. Appointment Scheduling

Patients can:

View available providers

Book appointments

Get real-time confirmation notifications

Providers can:

View incoming appointment requests

Accept appointments instantly

Start video calls

Admins can:

View all appointments

Cancel/delete appointments

🎥 3. Real-Time Video Consultations (WebRTC)

Secure peer-to-peer video calls

Built using:

WebRTC

Socket.io signaling

Camera & mic toggle

Responsive layout

💬 4. Real-Time Instant Messaging

Patient ↔ Provider chat

Online status indicator

Typing indicator

Chat stored in MongoDB

Delivered instantly with Socket.io

📊 5. Admin Dashboard

Admins can:

View all users

Suspend/delete users

Promote patients → providers

Approve providers

View system-wide analytics

🔔 6. System-Wide Notifications

Implemented using:

Socket.io

ShadCN UI toaster

Includes:

New appointment alerts

Appointment acceptance alerts

Incoming chat messages

Typing notifications

🛠 Tech Stack
Frontend

React + Vite

TailwindCSS

ShadCN/UI components

Socket.io Client

WebRTC

Context API

Backend

Node.js

Express.js

MongoDB + Mongoose

Socket.io

JWT Authentication

Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

📡 System Architecture
Frontend (React, Vite, Socket.io-client)
│
├── Auth (Login, Register, Role-based)
├── Telemedicine UI (Appointments + Video Call + Chat)
├── Admin Panel (Dashboard + CRUD)
│
▼
Backend (Node.js, Express)
│
├── Auth API (JWT)
├── Appointment API
├── Chat API
├── Admin API
├── Analytics API
│
▼
Database (MongoDB Atlas)
│
├── Users Collection
├── Appointments Collection
├── Chat Messages Collection
│
▼
Socket Server (Socket.io)
├── Realtime messaging
├── Typing indicators
├── Notifications
├── WebRTC signaling

📥 Installation & Setup (Local Development)
1️⃣ Clone the Repository
git clone https://github.com/YOUR-USERNAME/digital-health-platform.git
cd digital-health-platform

▶ Backend Setup
cd server
npm install


Create a .env file:

MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
PORT=5000


Start backend:

npm run dev

💻 Frontend Setup
cd client
npm install
npm run dev

🔌 API Routes Overview
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Create new user
POST	/api/auth/login	Login and receive JWT
👨‍⚕️ Users / Providers
Method	Endpoint	Description
GET	/api/users/providers	Get verified providers
GET	/api/users/me	Get logged-in user
📅 Appointments
Method	Endpoint	Description
POST	/api/appointments	Patient creates appointment
GET	/api/appointments	Get appointments (role-based)
PUT	/api/appointments/:id/accept	Provider accepts
📊 Admin
Method	Endpoint	Description
GET	/api/admin/users	All users
PUT	/api/admin/promote/:id	Promote user
PUT	/api/admin/approve-provider/:id	Verify provider
GET	/api/admin/stats	Summary analytics
💬 Chat API
Method	Endpoint	Description
POST	/api/chat/send	Store message in DB
GET	/api/chat/history/:userId	Get conversation history
🌍 SDG Alignment — SDG 3: Good Health & Well-Being

This project contributes directly to:

✔ Universal access to healthcare services

Teleconsultations reduce geographical and financial barriers.

✔ Improve responsiveness of health systems

Real-time communication & analytics help providers assist faster.

✔ Digital transformation in healthcare

Encourages innovation in modern medical service delivery.

✔ Strengthening telemedicine infrastructure

Builds resilient, scalable, cloud-based health services.

📸 Screenshots Available

   landing.png
   login.png
   dashboard.png
   appointments.png
   videocall.png
   chat.png
   admin.png

🧭 Future Improvements

AI Symptom Checker

EHR (Electronic Health Records) module

Appointment reminders via SMS/Email

Provider availability calendar

Multi-user group chat

Push Notifications

PWA mobile app version

🤝 Contributing

Pull requests are welcome!
Open an issue first for new features or bug fixes.

📄 License

MIT License — Freely available for personal and academic use.