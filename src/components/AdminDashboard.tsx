import type { Assignment, Submission, User } from "../types"
import AssignmentForm from "./AssignmentForm"

type AdminDashboardProps = {
  currentUser: User
  assignments: Assignment[]
  submissions: Submission[]
  users: User[]
  onCreateAssignment: (assignment: Assignment) => void
}

function AdminDashboard({
  currentUser,
  assignments,
  submissions,
  users,
  onCreateAssignment
}: AdminDashboardProps) {
  const adminAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id
  )

  const students = users.filter(
    (user) => user.role === "student"
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Manage assignments and track student submissions.
        </p>
      </div>

      <AssignmentForm
        currentUserId={currentUser.id}
        onCreateAssignment={onCreateAssignment}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {adminAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {assignment.title}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {assignment.description}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              Due: {assignment.dueDate}
            </p>

            <div className="mt-5 space-y-4">
              {students.map((student) => {
                const submission = submissions.find(
                  (submission) =>
                    submission.assignmentId === assignment.id &&
                    submission.studentId === student.id
                )

                const isSubmitted =
                  submission?.status === "submitted"

                return (
                  <div key={student.id}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {student.name}
                      </span>

                      <span className="text-xs text-gray-500">
                        {isSubmitted
                          ? "Submitted"
                          : "Not submitted"}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: isSubmitted ? "100%" : "0%",
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard