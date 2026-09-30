import { useEffect, useState } from "react"

import type {
  Assignment,
  Course,
  Submission,
  User,
} from "../types"

type CourseAssignmentsProps = {
  currentUser: User
  course: Course
  assignments: Assignment[]
  submissions: Submission[]
  onBack: () => void
  onAssignmentSelect: (assignmentId: string) => void
  onCreateAssignment: () => void
  onEditAssignment: (assignment: Assignment) => void
  onDeleteAssignment: (assignmentId: string) => void
}

function CourseAssignments({
  currentUser,
  course,
  assignments,
  submissions,
  onBack,
  onAssignmentSelect,
  onCreateAssignment,
  onEditAssignment,
  onDeleteAssignment,
}: CourseAssignmentsProps) {
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<Assignment | null>(null)

  const [isClosing, setIsClosing] = useState(false)

  const courseAssignments = assignments.filter(
    (assignment) => assignment.courseId === course.id
  )

  const isProfessor = currentUser.role === "admin"

  const getAnalytics = (assignment: Assignment) => {
    const assignmentSubmissions = submissions.filter(
      (submission) => submission.assignmentId === assignment.id
    )

    if (assignment.submissionType === "group") {
      const groupIds = new Set(
        assignmentSubmissions
          .map((submission) => submission.groupId)
          .filter(
            (groupId): groupId is string => Boolean(groupId)
          )
      )

      const submittedGroupIds = new Set(
        assignmentSubmissions
          .filter(
            (submission) => submission.status === "submitted"
          )
          .map((submission) => submission.groupId)
          .filter(
            (groupId): groupId is string => Boolean(groupId)
          )
      )

      const total = groupIds.size
      const submitted = submittedGroupIds.size
      const pending = Math.max(total - submitted, 0)

      const progress =
        total === 0
          ? 0
          : Math.round((submitted / total) * 100)

      return {
        total,
        submitted,
        pending,
        progress,
        unit: "groups",
      }
    }

    const total = course.studentIds.length

    const submitted = assignmentSubmissions.filter(
      (submission) => submission.status === "submitted"
    ).length

    const pending = Math.max(total - submitted, 0)

    const progress =
      total === 0
        ? 0
        : Math.round((submitted / total) * 100)

    return {
      total,
      submitted,
      pending,
      progress,
      unit: "students",
    }
  }

  const getStudentSubmission = (assignment: Assignment) => {
    return submissions.find(
      (submission) =>
        submission.assignmentId === assignment.id &&
        submission.studentId === currentUser.id
    )
  }

  const formatDueDate = (dueDate: string) => {
    return new Date(dueDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleCloseDeleteModal = () => {
    if (isClosing) {
      return
    }

    setIsClosing(true)

    window.setTimeout(() => {
      setAssignmentToDelete(null)
      setIsClosing(false)
    }, 180)
  }

  const handleDeleteConfirm = () => {
    if (!assignmentToDelete || isClosing) {
      return
    }

    onDeleteAssignment(assignmentToDelete.id)
    handleCloseDeleteModal()
  }

  useEffect(() => {
    if (!assignmentToDelete) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseDeleteModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [assignmentToDelete, isClosing])

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:-translate-x-0.5 hover:text-gray-900"
      >
        <span>←</span>
        Back to courses
      </button>

      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              {course.code}
            </span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              {course.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {course.semester}
            </p>
          </div>

          {isProfessor && (
            <button
              type="button"
              onClick={onCreateAssignment}
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            >
              + Create Assignment
            </button>
          )}
        </div>

        <div className="mt-6 grid max-w-xs grid-cols-1">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <p className="text-xs text-gray-500">
              Assignments
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {courseAssignments.length}
            </p>
          </div>
        </div>
      </div>

      {courseAssignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No assignments yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {isProfessor
              ? "Create an assignment for this course to get started."
              : "Your professor hasn't added any assignments yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {courseAssignments.map((assignment) => {
            const analytics = getAnalytics(assignment)

            const studentSubmission =
              getStudentSubmission(assignment)

            const isStudentSubmitted =
              studentSubmission?.status === "submitted"

            return (
              <div
                key={assignment.id}
                className="group w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {assignment.title}
                      </h2>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${assignment.submissionType === "group"
                            ? "bg-violet-50 text-violet-700"
                            : "bg-blue-50 text-blue-700"
                          }`}
                      >
                        {assignment.submissionType === "group"
                          ? "Group"
                          : "Individual"}
                      </span>

                      {!isProfessor && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${isStudentSubmitted
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                            }`}
                        >
                          {isStudentSubmitted
                            ? "✓ Acknowledged"
                            : "Not acknowledged"}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                      {assignment.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                      <span>
                        Due {formatDueDate(assignment.dueDate)}
                      </span>

                      <span>
                        {course.studentIds.length} students
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onAssignmentSelect(assignment.id)
                      }
                      className="text-sm font-medium text-blue-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-700 active:scale-95"
                    >
                      View →
                    </button>

                    {isProfessor && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            onEditAssignment(assignment)
                          }
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setAssignmentToDelete(assignment)
                          }
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isProfessor && (
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">
                        Submission progress
                      </span>

                      <span className="text-xs font-semibold text-gray-700">
                        {analytics.submitted} /{" "}
                        {analytics.total} {analytics.unit}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{
                          width: `${analytics.progress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {analytics.submitted} submitted ·{" "}
                        {analytics.pending} pending
                      </span>

                      <span className="font-medium text-gray-700">
                        {analytics.progress}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {assignmentToDelete && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px] ${isClosing
              ? "animate-[fadeOut_0.18s_ease-in_forwards]"
              : "animate-[fadeIn_0.18s_ease-out]"
            }`}
        >
          <div
            className={`w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl ${isClosing
                ? "animate-[slideOut_0.18s_ease-in_forwards]"
                : "animate-[slideIn_0.2s_ease-out]"
              }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-assignment-title"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-semibold text-red-600">
                !
              </div>

              <h2
                id="delete-assignment-title"
                className="text-lg font-semibold text-gray-900"
              >
                Delete assignment?
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                "{assignmentToDelete.title}"
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isClosing}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isClosing}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseAssignments