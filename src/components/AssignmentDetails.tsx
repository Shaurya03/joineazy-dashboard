import GroupPanel from "./GroupPanel"
import type {
  Assignment,
  Course,
  Submission,
  User,
  Group,
  GroupMember
} from "../types"

type AssignmentDetailsProps = {
  currentUser: User
  assignment: Assignment
  course: Course
  submissions: Submission[]
  onBack: () => void
  onAcknowledge: (assignmentId: string) => void
  onAcknowledgeGroupSubmission: (assignmentId: string) => void
  groups: Group[]
  groupMembers: GroupMember[]
  users: User[]
  onCreateGroup: (name: string) => void
  onJoinGroup: (groupId: string) => void
}

function AssignmentDetails({
  currentUser,
  assignment,
  course,
  submissions,
  onBack,
  onAcknowledge,
  onAcknowledgeGroupSubmission,
  groups,
  groupMembers,
  users,
  onCreateGroup,
  onJoinGroup
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

  const currentMembership = groupMembers.find(
    (member) =>
      member.studentId === currentUser.id &&
      groups.some(
        (group) =>
          group.id === member.groupId &&
          group.courseId === course.id
      )
  )

  const currentGroup = currentMembership
    ? groups.find((group) => group.id === currentMembership.groupId)
    : undefined

  const currentGroupMembers = currentGroup
    ? groupMembers
      .filter((member) => member.groupId === currentGroup.id)
      .map((member) => users.find((user) => user.id === member.studentId))
      .filter(Boolean)
    : []

  const isGroupLeader =
    currentGroup?.leaderId === currentUser.id

  const groupSubmissions = currentGroup
    ? submissions.filter(
      (submission) =>
        submission.assignmentId === assignment.id &&
        submission.groupId === currentGroup.id
    )
    : []

  const groupAcknowledged =
    currentGroupMembers.length > 0 &&
    currentGroupMembers.every((member) =>
      groupSubmissions.some(
        (submission) =>
          submission.studentId === member?.id &&
          submission.status === "submitted"
      )
    )

  const groupAcknowledgedAt = groupSubmissions.find(
    (submission) => submission.status === "submitted"
  )?.acknowledgedAt

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
          <div className="flex flex-col gap-6">
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

            {!isProfessor &&
              assignment.submissionType === "individual" && (
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  {isSubmitted ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-emerald-700">
                          Submission acknowledged
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {studentSubmission?.acknowledgedAt
                            ? `Acknowledged on ${new Date(
                              studentSubmission.acknowledgedAt
                            ).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}`
                            : "Your submission has been acknowledged."}
                        </p>
                      </div>

                      <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        ✓ Acknowledged
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Have you submitted your work?
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Confirm your submission after uploading your work
                          to OneDrive.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onAcknowledge(assignment.id)}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                      >
                        Acknowledge Submission
                      </button>
                    </div>
                  )}
                </div>
              )}

            {!isProfessor &&
              assignment.submissionType === "group" && (
                <GroupPanel
                  currentUser={currentUser}
                  course={course}
                  groups={groups}
                  groupMembers={groupMembers}
                  users={users}
                  onCreateGroup={onCreateGroup}
                  onJoinGroup={onJoinGroup}
                />
              )}

            {assignment.submissionType === "group" && currentGroup && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
                    Group submission
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-slate-900">
                    {currentGroup.name}
                  </h3>
                </div>

                {groupAcknowledged ? (
                  <div className="rounded-xl bg-emerald-50 p-4">
                    <p className="font-semibold text-emerald-700">
                      Group submission acknowledged
                    </p>

                    {groupAcknowledgedAt && (
                      <p className="mt-1 text-sm text-emerald-600">
                        Acknowledged on{" "}
                        {new Date(groupAcknowledgedAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                ) : isGroupLeader ? (
                  <div className="rounded-xl bg-violet-50 p-4">
                    <p className="font-medium text-slate-900">
                      You are the Group Leader
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Acknowledge the submission once your group has submitted the
                      assignment.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        onAcknowledgeGroupSubmission(assignment.id)
                      }
                      className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Acknowledge Group Submission
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="font-semibold text-amber-700">
                      Waiting for your Group Leader
                    </p>

                    <p className="mt-1 text-sm text-amber-600">
                      Only the Group Leader can acknowledge this submission.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignmentDetails