import { useState } from "react"
import type {
  Course,
  Group,
  GroupMember,
  User,
} from "../types"

type GroupPanelProps = {
  currentUser: User
  course: Course
  groups: Group[]
  groupMembers: GroupMember[]
  users: User[]
  onCreateGroup: (name: string) => void
  onJoinGroup: (groupId: string) => void
}

function GroupPanel({
  currentUser,
  course,
  groups,
  groupMembers,
  users,
  onCreateGroup,
  onJoinGroup,
}: GroupPanelProps) {
  const courseGroups = groups.filter(
    (group) => group.courseId === course.id
  )

  const currentMembership = groupMembers.find(
    (member) => member.studentId === currentUser.id &&
      courseGroups.some((group) => group.id === member.groupId)
  )

  const currentGroup = currentMembership
    ? courseGroups.find(
      (group) => group.id === currentMembership.groupId
    )
    : undefined

  const [groupName, setGroupName] = useState("")

  const handleCreate = () => {
    const trimmedName = groupName.trim()

    if (!trimmedName) {
      return
    }

    onCreateGroup(trimmedName)
    setGroupName("")
  }

  if (currentGroup) {
    const members = groupMembers
      .filter((member) => member.groupId === currentGroup.id)
      .map((member) =>
        users.find((user) => user.id === member.studentId)
      )
      .filter(Boolean)

    const isLeader =
      currentGroup.leaderId === currentUser.id

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
              Your group
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {currentGroup.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {members.length} member
              {members.length !== 1 ? "s" : ""}
            </p>
          </div>

          {isLeader && (
            <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
              Group Leader
            </span>
          )}
        </div>

        <div className="mt-5 space-y-2">
          {members.map((member) => (
            <div
              key={member!.id}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-800">
                {member!.name}
              </span>

              {member!.id === currentGroup.leaderId && (
                <span className="text-xs font-medium text-violet-600">
                  Leader
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        No group
      </p>

      <h2 className="mt-1 text-xl font-bold text-gray-900">
        You're not in a group yet
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Form a new group or join an existing group for this course
        before submitting group assignments.
      </p>

      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700">
          Create a group
        </label>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={groupName}
            onChange={(event) =>
              setGroupName(event.target.value)
            }
            placeholder="e.g. Code Wizards"
            className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={handleCreate}
            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Create Group
          </button>
        </div>
      </div>

      {courseGroups.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">
            Or join an existing group
          </p>

          <div className="mt-2 space-y-2">
            {courseGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {group.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {groupMembers.filter(
                      (member) => member.groupId === group.id
                    ).length}{" "}
                    members
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onJoinGroup(group.id)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupPanel