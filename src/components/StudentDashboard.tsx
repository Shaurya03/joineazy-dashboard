import type { Assignment, Submission, User } from "../types"
import AssignmentCard from "./AssignmentCard"

type StudentDashboardProps = {
  currentUser: User
  assignments: Assignment[]
  submissions: Submission[]
  onConfirmSubmission: (assignmentId: string) => void
}

function StudentDashboard({
  currentUser,
  assignments,
  submissions,
  onConfirmSubmission,
}: StudentDashboardProps) {
  const studentSubmissions = submissions.filter(
    (submission) => submission.studentId === currentUser.id
  )

  const submittedCount = studentSubmissions.filter(
    (submission) => submission.status === "submitted"
  ).length

  const progress =
    assignments.length === 0
      ? 0
      : Math.round((submittedCount / assignments.length) * 100)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          My Assignments
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Track your assignments and submission progress.
        </p>
      </div>

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Overall Progress
            </p>

            <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
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

      <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => {
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
                onConfirmSubmission(assignment.id)
              }
            />
          )
        })}
      </div>
    </>
  )
}

export default StudentDashboard