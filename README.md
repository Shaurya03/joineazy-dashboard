# Joineazy Assignment & Review Dashboard

A responsive role-based dashboard for managing student assignments and tracking submission progress.

This project was built as part of the **Joineazy Frontend Intern Assignment** using React, TypeScript, and Tailwind CSS.

## Overview

The application provides separate experiences for:

- **Students**: View assigned work, track submission progress, open external assignment links, and confirm submissions.
- **Admins/Professors**: Create, edit, and delete assignments and track submission progress for each student.

The application uses mock data and browser `localStorage` instead of a backend, as the assignment does not require backend implementation.

## Features

### Student

- View personal assignments
- View overall submission progress
- Open external assignment/submission links
- Confirm assignment submission through a verification modal
- View submitted/not-submitted status
- Submission state persists using `localStorage`

### Admin

- Create assignments
- Edit assignments
- Delete assignments
- Add external Google Drive links
- View all students associated with assignments
- View individual student submission status
- View submission progress bars for each student

### Authentication

The project includes a simulated authentication flow for demonstration purposes.

- Student and admin demo accounts
- Login persistence using `localStorage`
- Logout functionality
- Role-based dashboard rendering

Authentication is intentionally mocked because the assignment does not require a backend.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Browser `localStorage`
- Mock JSON data

## Project Structure

```text
src/
├── components/
│   ├── AdminDashboard.tsx
│   ├── AssignmentCard.tsx
│   ├── AssignmentForm.tsx
│   ├── Login.tsx
│   ├── Navbar.tsx
│   └── StudentDashboard.tsx
│
├── data/
│   └── mockData.ts
│
├── types/
│   └── index.ts
│
├── App.tsx
├── index.css
└── main.tsx