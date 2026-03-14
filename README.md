<div align="center">

# 📚 Library Visitor Tracking System

**LVTS** — A modern, digital solution monitoring in library environments.

[![React](https://img.shields.io/badge/React-18.3.3-61AFEF?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.6-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.34.3-EF4EA3?style=flat-square&logo=framer)](https://www.framer.com/motion/)

</div>

---

## 📖 Overview

The **Library Visitor Tracking System (LVTS)** is a digital solution that automates visitor registration and monitoring for libraries. It allows staff to securely record visitor information, track entry and exit times, and generate real-time reports through an intuitive admin dashboard.

By replacing manual logbooks, LVTS improves operational efficiency, provides data-driven insights into library usage trends, and enhances security and accountability within the library environment. Access is restricted to institutional accounts (`@neu.edu.ph`) via Firebase Google Authentication.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Institutional Auth** | Google Sign-In restricted to `@neu.edu.ph` domain via Firebase |
| 📊 **Dashboard Overview** | Real-time visitor counter, daily/weekly/monthly stats, and charts |
| 👤 **User Management** | Search, filter, block/unblock users with reason tracking |
| 📋 **Visit Logs** | View, filter, export, and delete invalid visit records |
| 🚫 **Blocked Users** | Dedicated page for managing and reviewing blocked accounts |
| 🏛️ **College** | Flexible College configuration |
| 📈 **Reports & Analytics** | Traffic charts, top visitors, visit reason breakdowns |
| 📥 **Export** | Export logs and reports to Excel (CSV) |
| 🖨️ **Print** | Print reports |


---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://reactjs.org/) | 18.3.3 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.2.2 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.6 | Utility-first styling |
| [Firebase](https://firebase.google.com/) | Latest | Authentication & backend |
| [Framer Motion](https://www.framer.com/motion/) | 12.34.3 | Animations & transitions |
| [Recharts](https://recharts.org/) | Latest | Data visualization |
| [React Router DOM](https://reactrouter.com/) | Latest | Client-side routing |


## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) `v18.0.0` or higher
- [npm](https://www.npmjs.com/) `v9.0.0` or higher (or `yarn`)
- A [Firebase](https://firebase.google.com/) project with **Google Authentication** enabled

---

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/library-visitor-tracking-system.git](https://github.com/seanorioque/LibraryVisitorTrackingSystem-)
cd LibraryVisitorTrackingSystem
```

---

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including React, TypeScript, Tailwind CSS, Firebase, Framer Motion, and Recharts.

---

### 3. Configure Firebase

Create a `.env` file in the root directory and add your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Never commit your `.env` file.** Ensure it is listed in `.gitignore`.

You can find these values in your Firebase project under:
**Project Settings → General → Your apps → SDK setup and configuration**

---

### 4. Configure Domain Restriction *(Optional)*

By default, authentication is restricted to `@neu.edu.ph` accounts. To change the allowed domain, locate the auth guard logic in your Firebase configuration file and update the domain check:

```typescript
// src/firebase/auth.ts (or similar)
const ALLOWED_DOMAIN = "neu.edu.ph"; // Change to your institution's domain
```

---

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

### 6. Build for Production

```bash
npm run build
```

The production-ready files will be output to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 🔐 Authentication Flow

1. User visits the app and is redirected to `/login`
2. User clicks **Sign in with Google**
3. Firebase verifies the account domain (`@neu.edu.ph` only)
4. On success, If the user is admin it will redirected to the admin dashboard, If the user is student it will redirected to the student dashboard.
5. On failure (non-institutional email), access is denied with an error message
6. Auth state is resolved before rendering to prevent race conditions on page refresh

---




