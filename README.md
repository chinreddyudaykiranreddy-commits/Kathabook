# Kathabook

Kathabook is a full-stack loan and customer management application for tracking customers, loans, and payment history.

## Live application

Visit Kathabook: [https://kathabook-frontend.onrender.com](https://kathabook-frontend.onrender.com)

Backend API: [https://kathabook-2.onrender.com/api/](https://kathabook-2.onrender.com/api/)

## Stack
- Frontend: React + Vite
- Backend: Django + Django REST Framework
- Authentication: JWT
- Database: SQLite (for local development)

## Features
- User registration and login
- Password reset flow
- Customer management
- Loan management
- Payment tracking
- Protected routes for authenticated users

## Project structure
- backend/ - Django REST API
- frontend/ - React app

## Run locally

### Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

For more details, see the frontend README.
