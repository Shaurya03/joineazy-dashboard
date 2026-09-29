import { useState } from "react"
import type { Assignment, SubmissionStatus } from "../types"

type AssignmentCardProps = {
  assignment: Assignment
  submissionStatus: SubmissionStatus
  onConfirmSubmission: () => void
}

function AssignmentCard({
  assignment,
  submissionStatus,
  onConfirmSubmission,
}: AssignmentCardProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  return (
    <>
      <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div>
          <h2 className="text-lg font-semibold leading-6 text-gray-900">
            {assignment.title}
          </h2>

          <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
            {assignment.description}
          </p>

          <div>
            <p className="text-sm text-gray-500">
              Due: {assignment.dueDate}
            </p>

            <span
              className={
                submissionStatus === "submitted"
                  ? "mt-2 inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                  : "mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
              }
            >
              {submissionStatus === "submitted"
                ? "Submitted"
                : "Not submitted"}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <a
              href={assignment.oneDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Open Assignment
              <span className="ml-1">↗</span>
            </a>

            {submissionStatus !== "submitted" && (
              <button
                type="button"
                onClick={() => setIsConfirming(true)}
                className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                I've Submitted
              </button>
            )}
          </div>

        </div>
      </article>

      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Confirm submission
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Have you actually submitted this assignment?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onConfirmSubmission()
                  setIsConfirming(false)
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AssignmentCard