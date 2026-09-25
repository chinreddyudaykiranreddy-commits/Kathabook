# Kathabook

Kathabook is a full-stack loan and customer management application designed for tracking customers, loan records, and payment history in one system.

The project is built with a Django REST API backend and a React frontend, with JWT-based authentication and protected user-specific data access.

## Project Overview

This app helps a business or lender manage:

- Customer profiles and contact details
- Loan applications and repayment schedules
- Payment records and transaction history
- User authentication and password recovery
- A dashboard for tracking key lending activity

Each user has their own records, so customers, loans, and payments are kept private and separated by account.

## Main Features

- User registration and login
- JWT authentication with protected routes
- Password reset flow using secure reset tokens
- Customer management (create, read, update, delete)
- Loan management tied to each customer
- Payment tracking linked to each loan
- Dashboard overview of application data
- Responsive web interface for desktop use

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Axios

### Backend
- Django
- Django REST Framework
- SQLite database
- JWT authentication
- Django CORS headers

## Project Structure

```bash
Kathabook/
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   ├── ledger/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── authentication.py
│   ├── manage.py
│   └── db.sqlite3
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## Backend Concepts

The backend uses Django models to represent the business data:

- UserAccount: stores user login and profile data
- Customer: stores customer details linked to a user
- Loan: stores loan amount, interest rate, duration, and dates
- Payment: stores payment amounts and dates for each loan
- PasswordResetToken: stores secure password reset tokens with expiration logic

The API is protected with authentication, and each view ensures a user can only access their own data.

## Frontend Flow

The frontend routes are organized as:

- Public pages: login, register, forgot password, reset password
- Protected pages: dashboard, customers, loans, payments

The app redirects unauthenticated users away from protected sections and verifies tokens before access is allowed.

## Getting Started

### 1. Start the backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
python manage.py migrate
python manage.py runserver
```

The Django server will run on:

- http://localhost:8000

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The React app will run on:

- http://localhost:5173

## Default Development Setup

The app is currently configured for local development with:

- Django frontend CORS enabled for localhost:5173
- SQLite database for local storage
- Console email backend for password reset testing

## Notes

This project is a practical example of a small lending management system and can be extended with features such as:

- reporting and analytics
- loan status tracking
- monthly summaries
- CSV export
- admin roles
- email delivery via SMTP

## Summary

Kathabook is a simple but complete business management app for tracking the relationships between users, customers, loans, and repayments. It gives a clear example of how a React frontend and Django REST backend can work together in a real-world CRUD application.
