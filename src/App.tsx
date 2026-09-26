import { useState } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import AssignmentCard from "./components/AssignmentCard"
import { assignments, submissions } from "./data/mockData"

function App() {
  const currentUserId = "student-1"

  const [submissionData, setSubmissionData] = useState(submissions)

  const studentSubmissions = submissionData.filter(
    (submission) => submission.studentId === currentUserId
  )

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
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                My Assignments
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Track your assignments and submission progress.
              </p>
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