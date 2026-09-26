import { useState } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import AssignmentCard from "./components/AssignmentCard"
import UserSwitcher from "./components/UserSwitcher"
import { assignments, submissions, users } from "./data/mockData"

function App() {

  const [currentUserId, setCurrentUserId] = useState("student-1")
  const [submissionData, setSubmissionData] = useState(submissions)

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
    assignments.length === 0
      ? 0
      : Math.round((submittedCount / assignments.length) * 100)

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
          <p className="text-sm text-gray-500">
            Logged in as: {currentUser?.name} ({currentUser?.role})
          </p>
          <div className="mb-6 flex justify-end">
            <UserSwitcher
              users={users}
              currentUserId={currentUserId}
              onUserChange={setCurrentUserId}
            />
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                My Assignments
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Track your assignments and submission progress.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
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
                  {submittedCount} of {assignments.length} submitted
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
              {assignments.map((assignment) => {
                const submission = studentSubmissions.find(
                  (submission) => submission.assignmentId === assignment.id
                )
                return (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    submissionStatus={submission?.status ?? "not-submitted"}
                    onConfirmSubmission={() =>
                      handleConfirmSubmission(assignment.id)
                    }
                  />
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App