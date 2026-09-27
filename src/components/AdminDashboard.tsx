import { useState } from "react"
import type { Assignment, Submission, User } from "../types"
import AssignmentForm from "./AssignmentForm"

type AdminDashboardProps = {
  currentUser: User
  assignments: Assignment[]
  submissions: Submission[]
  users: User[]
  onCreateAssignment: (assignment: Assignment) => void
  onDeleteAssignment: (assignmentId: string) => void
  onUpdateAssignment: (assignment: Assignment) => void
}

function AdminDashboard({
  currentUser,
  assignments,
  submissions,
  users,
  onCreateAssignment,
  onDeleteAssignment,
  onUpdateAssignment,
}: AdminDashboardProps) {
  const [editingAssignment, setEditingAssignment] =
    useState<Assignment | undefined>()

  const adminAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id
  )

  const students = users.filter(
    (user) => user.role === "student"
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Manage assignments and track student submissions.
        </p>
      </div>

      <AssignmentForm
        currentUserId={currentUser.id}
        assignmentToEdit={editingAssignment}
        onCreateAssignment={onCreateAssignment}
        onUpdateAssignment={(assignment) => {
          onUpdateAssignment(assignment)
          setEditingAssignment(undefined)
        }}
      />

      <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
        {adminAssignments.map((assignment) => (
          <article
            key={assignment.id}
            className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="min-w-0 text-lg font-semibold leading-6 text-gray-900">
                  {assignment.title}
                </h2>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAssignment(assignment)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteAssignment(assignment.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-3 min-h-[48px] text-sm leading-6 text-gray-600">
                {assignment.description}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                Due: {assignment.dueDate}
              </p>

              <a
                href={assignment.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Open Assignment
                <span className="ml-1">↗</span>
              </a>
            </div>

            <div className="mt-auto pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Student Progress
                </h3>

                <span className="text-xs text-gray-500">
                  {students.length} students
                </span>
              </div>

              <div className="space-y-4">
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
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-medium text-gray-700">
                          {student.name}
                        </span>

                        <span
                          className={
                            isSubmitted
                              ? "shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                              : "shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
                          }
                        >
                          {isSubmitted
                            ? "Submitted"
                            : "Not submitted"}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-300"
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
          </article>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard