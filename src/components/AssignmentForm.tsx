import { useEffect, useState } from "react"
import type { Assignment } from "../types"

type AssignmentFormProps = {
  currentUserId: string
  courseId: string
  assignmentToEdit?: Assignment
  onCreateAssignment: (assignment: Assignment) => void
  onUpdateAssignment: (assignment: Assignment) => void
  onCancel: () => void
}

function AssignmentForm({
  currentUserId,
  courseId,
  assignmentToEdit,
  onCreateAssignment,
  onUpdateAssignment,
  onCancel,
}: AssignmentFormProps) {
  const [title, setTitle] = useState(
    assignmentToEdit?.title ?? ""
  )

  const [description, setDescription] = useState(
    assignmentToEdit?.description ?? ""
  )

  const [dueDate, setDueDate] = useState(
    assignmentToEdit?.dueDate?.split("T")[0] ?? ""
  )

  const [oneDriveLink, setOneDriveLink] = useState(
    assignmentToEdit?.oneDriveLink ?? ""
  )

  const [submissionType, setSubmissionType] = useState<
    "individual" | "group"
  >(
    assignmentToEdit?.submissionType ?? "individual"
  )

  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    setTitle(assignmentToEdit?.title ?? "")
    setDescription(assignmentToEdit?.description ?? "")
    setDueDate(
      assignmentToEdit?.dueDate?.split("T")[0] ?? ""
    )
    setOneDriveLink(assignmentToEdit?.oneDriveLink ?? "")
    setSubmissionType(
      assignmentToEdit?.submissionType ?? "individual"
    )
    setIsClosing(false)
  }, [assignmentToEdit])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isClosing])

  const handleClose = () => {
    if (isClosing) {
      return
    }

    setIsClosing(true)

    window.setTimeout(() => {
      onCancel()
    }, 180)
  }

  const handleSubmit = (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const formattedDueDate = `${dueDate}T23:59`

    if (assignmentToEdit) {
      onUpdateAssignment({
        ...assignmentToEdit,
        title,
        description,
        dueDate: formattedDueDate,
        oneDriveLink,
        submissionType,
      })
    } else {
      const newAssignment: Assignment = {
        id: `assignment-${Date.now()}`,
        courseId,
        title,
        description,
        dueDate: formattedDueDate,
        oneDriveLink,
        submissionType,
        createdBy: currentUserId,
      }

      onCreateAssignment(newAssignment)
    }

    setTitle("")
    setDescription("")
    setDueDate("")
    setOneDriveLink("")
    setSubmissionType("individual")
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px] ${isClosing
        ? "animate-[fadeOut_0.18s_ease-in_forwards]"
        : "animate-[fadeIn_0.2s_ease-out]"
        }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-form-title"
    >
      <div
        className={`flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl ${isClosing
          ? "animate-[slideOut_0.18s_ease-in_forwards]"
          : "animate-[slideIn_0.2s_ease-out]"
          }`}
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="assignment-form-title"
              className="text-xl font-semibold tracking-tight text-gray-900"
            >
              {assignmentToEdit
                ? "Edit Assignment"
                : "Create Assignment"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {assignmentToEdit
                ? "Update the assignment details below."
                : "Add a new assignment for this course."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close assignment form"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 active:scale-95"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="overflow-y-auto px-5 py-5 sm:px-6">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="assignment-title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title
                </label>

                <input
                  id="assignment-title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  required
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  placeholder="e.g. React Hooks"
                />
              </div>

              <div>
                <label
                  htmlFor="assignment-description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="assignment-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  required
                  rows={4}
                  className="mt-1.5 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  placeholder="Describe the assignment..."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="assignment-due-date"
                    className="text-sm font-medium text-gray-700"
                  >
                    Due Date
                  </label>

                  <input
                    id="assignment-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(event) =>
                      setDueDate(event.target.value)
                    }
                    required
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="assignment-type"
                    className="text-sm font-medium text-gray-700"
                  >
                    Submission Type
                  </label>

                  <select
                    id="assignment-type"
                    value={submissionType}
                    onChange={(event) =>
                      setSubmissionType(
                        event.target.value as
                        | "individual"
                        | "group"
                      )
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="individual">
                      Individual
                    </option>

                    <option value="group">
                      Group
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="assignment-onedrive"
                  className="text-sm font-medium text-gray-700"
                >
                  OneDrive Link
                </label>

                <input
                  id="assignment-onedrive"
                  type="url"
                  value={oneDriveLink}
                  onChange={(event) =>
                    setOneDriveLink(event.target.value)
                  }
                  required
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  placeholder="https://onedrive.live.com/example/assignment"
                />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            >
              {assignmentToEdit
                ? "Save Changes"
                : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignmentForm