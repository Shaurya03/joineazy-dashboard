import type {
  Assignment,
  Course,
  Group,
  GroupMember,
  Submission,
  User,
} from "../types"

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
  {
    id: "student-4",
    name: "Neha Kapoor",
    email: "neha@example.com",
    role: "student",
  },
]

export const courses: Course[] = [
  {
    id: "course-1",
    name: "Advanced Web Development",
    code: "CSE-401",
    semester: "Fall 2026",
    professorId: "admin-1",
    studentIds: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
    ],
  },
  {
    id: "course-2",
    name: "Software Engineering",
    code: "CSE-402",
    semester: "Fall 2026",
    professorId: "admin-1",
    studentIds: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
    ],
  },
]

export const assignments: Assignment[] = [
  {
    id: "assignment-1",
    courseId: "course-1",
    title: "React Dashboard",
    description:
      "Build a responsive dashboard using React, TypeScript and Tailwind CSS.",
    dueDate: "2026-09-30T23:59",
    oneDriveLink:
      "https://onedrive.live.com/example/react-dashboard",
    submissionType: "individual",
    createdBy: "admin-1",
  },
  {
    id: "assignment-2",
    courseId: "course-1",
    title: "API Integration",
    description:
      "Integrate a REST API and display the data using a clean user interface.",
    dueDate: "2026-10-05T23:59",
    oneDriveLink:
      "https://onedrive.live.com/example/api-integration",
    submissionType: "group",
    createdBy: "admin-1",
  },
  {
    id: "assignment-3",
    courseId: "course-2",
    title: "Software Design Document",
    description:
      "Create a software design document describing the architecture of a proposed application.",
    dueDate: "2026-10-02T23:59",
    oneDriveLink:
      "https://onedrive.live.com/example/software-design",
    submissionType: "individual",
    createdBy: "admin-1",
  },
]

export const groups: Group[] = [
  {
    id: "group-1",
    courseId: "course-1",
    name: "Pixel Pioneers",
    leaderId: "student-1",
  },
]

export const groupMembers: GroupMember[] = [
  {
    groupId: "group-1",
    studentId: "student-1",
  },
  {
    groupId: "group-1",
    studentId: "student-2",
  },
]

export const submissions: Submission[] = [
  {
    id: "submission-1",
    assignmentId: "assignment-1",
    studentId: "student-1",
    status: "submitted",
    acknowledgedAt: "2026-09-27T14:30:00",
  },
  {
    id: "submission-2",
    assignmentId: "assignment-1",
    studentId: "student-2",
    status: "submitted",
    acknowledgedAt: "2026-09-27T15:10:00",
  },
  {
    id: "submission-3",
    assignmentId: "assignment-1",
    studentId: "student-3",
    status: "not-submitted",
  },
  {
    id: "submission-4",
    assignmentId: "assignment-1",
    studentId: "student-4",
    status: "not-submitted",
  },
  {
    id: "submission-5",
    assignmentId: "assignment-2",
    studentId: "student-1",
    groupId: "group-1",
    status: "not-submitted",
  },
  {
    id: "submission-6",
    assignmentId: "assignment-2",
    studentId: "student-2",
    groupId: "group-1",
    status: "not-submitted",
  },
  {
    id: "submission-7",
    assignmentId: "assignment-3",
    studentId: "student-1",
    status: "not-submitted",
  },
]