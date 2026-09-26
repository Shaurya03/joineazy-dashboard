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
  onConfirmSubmission
}: AssignmentCardProps) {

  const [isConfirming, setIsConfirming] = useState(false)

  return (
    <>
      <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {assignment.title}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {assignment.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Due: {assignment.dueDate}
            </p>

            <span
              className={
                submissionStatus === "submitted"
                  ? "mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                  : "mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
              }
            >
              {submissionStatus === "submitted"
                ? "Submitted"
                : "Not submitted"}
            </span>
          </div>

          {submissionStatus === "submitted" ? (
            <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500">
              Submitted
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirming(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              I've Submitted
            </button>
          )}
        </div>
      </article>

      {
        isConfirming && (
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
        )
      }
    </>
  )
}

export default AssignmentCard