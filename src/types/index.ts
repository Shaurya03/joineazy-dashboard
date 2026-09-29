export type UserRole = "student" | "admin"

export type SubmissionType = "individual" | "group"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

export type Course = {
  id: string
  name: string
  code: string
  semester: string
  professorId: string
  studentIds: string[]
}

export type Assignment = {
  id: string
  courseId: string
  title: string
  description: string
  dueDate: string
  oneDriveLink: string
  submissionType: SubmissionType
  createdBy: string
}

export type Group = {
  id: string
  courseId: string
  name: string
  leaderId: string
}

export type GroupMember = {
  groupId: string
  studentId: string
}

export type SubmissionStatus = "submitted" | "not-submitted"

export type Submission = {
  id: string
  assignmentId: string
  studentId: string
  groupId?: string
  status: SubmissionStatus
  acknowledgedAt?: string
}