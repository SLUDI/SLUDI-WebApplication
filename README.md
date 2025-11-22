# SLUDI Web Application

A comprehensive web application for managing digital identities, driving license issuance, and organization permissions.

## Features

- **Authentication**: Secure sign-in and token-based session management.
- **Dashboard & Analytics**: Visual insights and reporting.
- **Identity Management**: Digital ID verification, booking, and form handling.
- **License Services**: Driving license requests, issuance, and status tracking.
- **Organization & User Management**: Role-based access and organization administration.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Ant Design
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Utilities**: Axios, Face-api.js, Framer Motion, React Webcam

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SLUDI/SLUDI-WebApplication.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SLUDI-WebApplication
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

- `src/api`: API integration logic
- `src/assets`: Static assets (images, icons)
- `src/components`: Reusable UI components
- `src/hooks`: Custom React hooks
- `src/pages`: Application pages/views
- `src/redux`: Redux store and slices
- `src/routes`: Routing configuration
- `src/services`: Business logic services
- `src/utils`: Helper functions and utilities
