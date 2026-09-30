import type { Assignment, Course, Submission, User } from "../types"

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
  onDeleteAssignment
}: CourseAssignmentsProps) {
  const courseAssignments = assignments.filter(
    (assignment) => assignment.courseId === course.id
  )

  const isProfessor = currentUser.role === "admin"

  const getProgress = (assignment: Assignment) => {
    const assignmentSubmissions = submissions.filter(
      (submission) =>
        submission.assignmentId === assignment.id
    )

    if (assignmentSubmissions.length === 0) {
      return 0
    }

    const submittedCount = assignmentSubmissions.filter(
      (submission) => submission.status === "submitted"
    ).length

    return Math.round(
      (submittedCount / assignmentSubmissions.length) * 100
    )
  }

  const formatDueDate = (dueDate: string) => {
    return new Date(dueDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
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
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              + Create Assignment
            </button>
          )}

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
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
            const progress = getProgress(assignment)

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
                      className="text-sm font-medium text-blue-600 transition-transform hover:translate-x-1"
                    >
                      View →
                    </button>

                    {isProfessor && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditAssignment(assignment)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const confirmed = window.confirm(
                              `Delete "${assignment.title}"?`
                            )

                            if (confirmed) {
                              onDeleteAssignment(assignment.id)
                            }
                          }}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CourseAssignments