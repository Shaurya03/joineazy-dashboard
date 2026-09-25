export type UserRole = "student" | "admin"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

export type Assignment = {
  id: string
  title: string
  description: string
  dueDate: string
  driveLink: string
  createdBy: string
}

export type SubmissionStatus = "submitted" | "not-submitted"

export type Submission = {
  id: string
  assignmentId: string
  studentId: string
  status: SubmissionStatus
  submittedAt?: string
}