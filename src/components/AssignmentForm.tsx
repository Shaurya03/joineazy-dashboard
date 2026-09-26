import { useEffect, useState } from "react"
import type { Assignment } from "../types"

type AssignmentFormProps = {
  currentUserId: string
  assignmentToEdit?: Assignment
  onCreateAssignment: (assignment: Assignment) => void
  onUpdateAssignment: (assignment: Assignment) => void
}

function AssignmentForm({
  currentUserId,
  assignmentToEdit,
  onCreateAssignment,
  onUpdateAssignment,
}: AssignmentFormProps) {
  const [title, setTitle] = useState(
    assignmentToEdit?.title ?? ""
  )

  const [description, setDescription] = useState(
    assignmentToEdit?.description ?? ""
  )

  const [dueDate, setDueDate] = useState(
    assignmentToEdit?.dueDate ?? ""
  )

  const [driveLink, setDriveLink] = useState(
    assignmentToEdit?.driveLink ?? ""
  )

  useEffect(() => {
    setTitle(assignmentToEdit?.title ?? "")
    setDescription(assignmentToEdit?.description ?? "")
    setDueDate(assignmentToEdit?.dueDate ?? "")
    setDriveLink(assignmentToEdit?.driveLink ?? "")
  }, [assignmentToEdit])

  const handleSubmit = (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (assignmentToEdit) {
      onUpdateAssignment({
        ...assignmentToEdit,
        title,
        description,
        dueDate,
        driveLink,
      })
    } else {
      const newAssignment: Assignment = {
        id: `assignment-${Date.now()}`,
        title,
        description,
        dueDate,
        driveLink,
        createdBy: currentUserId,
      }

      onCreateAssignment(newAssignment)
    }

    setTitle("")
    setDescription("")
    setDueDate("")
    setDriveLink("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {assignmentToEdit
          ? "Edit Assignment"
          : "Create Assignment"}
      </h2>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="e.g. React Hooks"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            required
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Describe the assignment..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Google Drive Link
            </label>

            <input
              type="url"
              value={driveLink}
              onChange={(event) =>
                setDriveLink(event.target.value)
              }
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="https://drive.google.com/..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {assignmentToEdit
              ? "Update Assignment"
              : "Create Assignment"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default AssignmentForm