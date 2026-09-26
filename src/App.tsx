import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import AssignmentCard from "./components/AssignmentCard"
import UserSwitcher from "./components/UserSwitcher"
import AdminDashboard from "./components/AdminDashboard"
import { assignments, submissions, users } from "./data/mockData"
import type { Assignment, Submission } from "./types"

function App() {

  const [currentUserId, setCurrentUserId] = useState("student-1")

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

  const studentSubmissions = submissionData.filter(
    (submission) => submission.studentId === currentUserId
  )

  const submittedCount = studentSubmissions.filter(
    (submission) => submission.status === "submitted"
  ).length

  const progress =
    assignmentData.length === 0
      ? 0
      : Math.round((submittedCount / assignmentData.length) * 100)

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="mb-6 flex justify-end">
            <UserSwitcher
              users={users}
              currentUserId={currentUserId}
              onUserChange={setCurrentUserId}
            />
          </div>

          <div className="mx-auto max-w-6xl">
            {currentUser?.role === "admin" ? (
              <AdminDashboard
                currentUser={currentUser}
                assignments={assignmentData}
                submissions={submissionData}
                users={users}
                onCreateAssignment={handleCreateAssignment}
                onDeleteAssignment={handleDeleteAssignment}
                onUpdateAssignment={handleUpdateAssignment}
              />
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">
                    My Assignments
                  </h1>

                  <p className="mt-1 text-sm text-gray-600">
                    Track your assignments and submission progress.
                  </p>
                </div>

                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Overall Progress
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        {progress}%
                      </p>
                    </div>

                    <p className="text-sm text-gray-500">
                      {submittedCount} of {assignmentData.length} submitted
                    </p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {assignmentData.map((assignment) => {
                    const submission = studentSubmissions.find(
                      (submission) =>
                        submission.assignmentId === assignment.id
                    )

                    return (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        submissionStatus={
                          submission?.status ?? "not-submitted"
                        }
                        onConfirmSubmission={() =>
                          handleConfirmSubmission(assignment.id)
                        }
                      />
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App