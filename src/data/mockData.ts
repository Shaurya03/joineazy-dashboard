import type { Assignment, Submission, User } from "../types"

export const users: User[] = [
  {
    id: "admin-1",
    name: "Dr. Sharma",
    email: "sharma@joineazy.com",
    role: "admin",
  },
  {
    id: "student-1",
    name: "Rahul Verma",
    email: "rahul@example.com",
    role: "student",
  },
  {
    id: "student-2",
    name: "Priya Singh",
    email: "priya@example.com",
    role: "student",
  },
  {
    id: "student-3",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    role: "student",
  },
]

export const assignments: Assignment[] = [
  {
    id: "assignment-1",
    title: "React Fundamentals",
    description: "Build a small React application using components and hooks.",
    dueDate: "2026-09-28",
    driveLink: "https://drive.google.com/example/react-fundamentals",
    createdBy: "admin-1",
  },
  {
    id: "assignment-2",
    title: "JavaScript ES6+",
    description: "Demonstrate modern JavaScript concepts including promises and modules.",
    dueDate: "2026-10-02",
    driveLink: "https://drive.google.com/example/javascript-es6",
    createdBy: "admin-1",
  },
  {
    id: "assignment-3",
    title: "Responsive Web Design",
    description: "Create a responsive landing page using Tailwind CSS.",
    dueDate: "2026-10-06",
    driveLink: "https://drive.google.com/example/responsive-design",
    createdBy: "admin-1",
  },
]

export const submissions: Submission[] = [
  {
    id: "submission-1",
    assignmentId: "assignment-1",
    studentId: "student-1",
    status: "submitted",
    submittedAt: "2026-09-24T14:30:00",
  },
  {
    id: "submission-2",
    assignmentId: "assignment-1",
    studentId: "student-2",
    status: "submitted",
    submittedAt: "2026-09-25T10:15:00",
  },
  {
    id: "submission-3",
    assignmentId: "assignment-1",
    studentId: "student-3",
    status: "not-submitted",
  },
  {
    id: "submission-4",
    assignmentId: "assignment-2",
    studentId: "student-1",
    status: "submitted",
    submittedAt: "2026-09-24T16:00:00",
  },
  {
    id: "submission-5",
    assignmentId: "assignment-2",
    studentId: "student-2",
    status: "not-submitted",
  },
  {
    id: "submission-6",
    assignmentId: "assignment-2",
    studentId: "student-3",
    status: "submitted",
    submittedAt: "2026-09-25T09:45:00",
  },
  {
    id: "submission-7",
    assignmentId: "assignment-3",
    studentId: "student-1",
    status: "not-submitted",
  },
  {
    id: "submission-8",
    assignmentId: "assignment-3",
    studentId: "student-2",
    status: "submitted",
    submittedAt: "2026-09-25T11:20:00",
  },
  {
    id: "submission-9",
    assignmentId: "assignment-3",
    studentId: "student-3",
    status: "not-submitted",
  },
]