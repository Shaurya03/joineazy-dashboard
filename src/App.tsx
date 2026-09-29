import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import CourseDashboard from "./components/CourseDashboard"
import { courses, assignments, submissions, users } from "./data/mockData"
import type { Assignment, Submission, User } from "./types"

function App() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem("currentUserId")
  })

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const [assignmentData, setAssignmentData] = useState<Assignment[]>(() => {
    const storedAssignments = localStorage.getItem("assignments")

    return storedAssignments
      ? JSON.parse(storedAssignments)
      : assignments
  })

  const [submissionData, setSubmissionData] = useState<Submission[]>(() => {
    const storedSubmissions = localStorage.getItem("submissions")

    return storedSubmissions
      ? JSON.parse(storedSubmissions)
      : submissions
  })

  useEffect(() => {
    localStorage.setItem(
      "assignments",
      JSON.stringify(assignmentData)
    )
  }, [assignmentData])

  useEffect(() => {
    localStorage.setItem(
      "submissions",
      JSON.stringify(submissionData)
    )
  }, [submissionData])

  const currentUser = users.find(
    (user) => user.id === currentUserId
  )

  const handleLogin = (user: User) => {
    setCurrentUserId(user.id)
    localStorage.setItem("currentUserId", user.id)
  }

  const handleLogout = () => {
    setCurrentUserId(null)
    localStorage.removeItem("currentUserId")
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId)
  }

  const handleCreateAssignment = (assignment: Assignment) => {
    setAssignmentData((currentAssignments) => [
      ...currentAssignments,
      assignment,
    ])

    const newSubmissions = users
      .filter((user) => user.role === "student")
      .map((student) => ({
        id: `submission-${Date.now()}-${student.id}`,
        assignmentId: assignment.id,
        studentId: student.id,
        status: "not-submitted" as const,
      }))

    setSubmissionData((currentSubmissions) => [
      ...currentSubmissions,
      ...newSubmissions,
    ])
  }

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignmentData((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === updatedAssignment.id
          ? updatedAssignment
          : assignment
      )
    )
  }

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignmentData((currentAssignments) =>
      currentAssignments.filter(
        (assignment) => assignment.id !== assignmentId
      )
    )

    setSubmissionData((currentSubmissions) =>
      currentSubmissions.filter(
        (submission) => submission.assignmentId !== assignmentId
      )
    )
  }

  const handleConfirmSubmission = (assignmentId: string) => {
    setSubmissionData((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission.assignmentId === assignmentId &&
          submission.studentId === currentUserId
          ? {
            ...submission,
            status: "submitted",
            submittedAt: new Date().toISOString(),
          }
          : submission
      )
    )
  }

  if (!currentUser) {
    return (
      <Login
        users={users}
        onLogin={handleLogin}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl p-6">
        <CourseDashboard
          currentUser={currentUser}
          courses={courses}
          onCourseSelect={handleCourseSelect}
        />
      </main>
    </div>
  )
}

export default App