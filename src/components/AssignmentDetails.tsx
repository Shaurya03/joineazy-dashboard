import type {
  Assignment,
  Course,
  Submission,
  User,
} from "../types"

type AssignmentDetailsProps = {
  currentUser: User
  assignment: Assignment
  course: Course
  submissions: Submission[]
  onBack: () => void
}

function AssignmentDetails({
  currentUser,
  assignment,
  course,
  submissions,
  onBack,
}: AssignmentDetailsProps) {
  const isProfessor = currentUser.role === "admin"

  const studentSubmission = submissions.find(
    (submission) =>
      submission.assignmentId === assignment.id &&
      submission.studentId === currentUser.id
  )

  const isSubmitted =
    studentSubmission?.status === "submitted"

  const formattedDeadline = new Date(
    assignment.dueDate
  ).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <span>←</span>
        Back to assignments
      </button>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {course.code}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${assignment.submissionType === "group"
                      ? "bg-violet-50 text-violet-700"
                      : "bg-blue-50 text-blue-700"
                    }`}
                >
                  {assignment.submissionType === "group"
                    ? "Group submission"
                    : "Individual submission"}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                {assignment.title}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {course.name}
              </p>
            </div>

            {!isProfessor && (
              <span
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${isSubmitted
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                  }`}
              >
                {isSubmitted
                  ? "Acknowledged"
                  : "Not acknowledged"}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Deadline
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              {formattedDeadline}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Submission type
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              {assignment.submissionType === "group"
                ? "Group"
                : "Individual"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900">
            Description
          </h2>

          <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-gray-600">
            {assignment.description}
          </p>
        </div>

        <div className="border-t border-gray-100 bg-gray-50/70 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Submission workspace
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Open the shared OneDrive location for this assignment.
              </p>
            </div>

            <a
              href={assignment.oneDriveLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Open OneDrive
              <span className="ml-2">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignmentDetails