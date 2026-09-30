import type {
  Assignment,
  Course,
  Group,
  GroupMember,
  Submission,
  User,
} from "../types"

type ProfessorSubmissionReportProps = {
  assignment: Assignment
  course: Course
  submissions: Submission[]
  groups: Group[]
  groupMembers: GroupMember[]
  users: User[]
}

function ProfessorSubmissionReport({
  assignment,
  course,
  submissions,
  groups,
  groupMembers,
  users,
}: ProfessorSubmissionReportProps) {
  const courseGroups = groups.filter(
    (group) => group.courseId === course.id
  )

  const courseStudents = course.studentIds
    .map((studentId) =>
      users.find((user) => user.id === studentId)
    )
    .filter((user): user is User => Boolean(user))

  const formatAcknowledgedAt = (date?: string) => {
    if (!date) {
      return null
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getGroupMembers = (groupId: string) => {
    return groupMembers
      .filter((member) => member.groupId === groupId)
      .map((member) =>
        users.find((user) => user.id === member.studentId)
      )
      .filter((user): user is User => Boolean(user))
  }

  const getGroupSubmission = (groupId: string) => {
    return submissions.find(
      (submission) =>
        submission.assignmentId === assignment.id &&
        submission.groupId === groupId &&
        submission.status === "submitted"
    )
  }

  const groupedStudentIds = new Set(
    courseGroups.flatMap((group) =>
      groupMembers
        .filter((member) => member.groupId === group.id)
        .map((member) => member.studentId)
    )
  )

  const studentsWithoutGroup = courseStudents.filter(
    (student) => !groupedStudentIds.has(student.id)
  )

  if (assignment.submissionType === "group") {
    const submittedGroups = courseGroups.filter((group) =>
      Boolean(getGroupSubmission(group.id))
    )

    const submittedCount = submittedGroups.length
    const totalGroups = courseGroups.length
    const pendingCount = Math.max(
      totalGroups - submittedCount,
      0
    )

    const progress =
      totalGroups === 0
        ? 0
        : Math.round((submittedCount / totalGroups) * 100)

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Submission report
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track group submissions and students who have not
              joined a group.
            </p>
          </div>

          <span className="text-sm font-semibold text-gray-700">
            {submittedCount} / {totalGroups} groups submitted
          </span>
        </div>

        <div className="mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {submittedCount} submitted · {pendingCount} pending
            </span>

            <span className="font-medium text-gray-700">
              {progress}%
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-900">
            Groups
          </h3>

          {courseGroups.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-500">
                No groups have been created yet.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {courseGroups.map((group) => {
                const members = getGroupMembers(group.id)
                const groupSubmission = getGroupSubmission(group.id)
                const isSubmitted = Boolean(groupSubmission)

                return (
                  <div
                    key={group.id}
                    className="rounded-xl border border-gray-200 bg-gray-50/70 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {group.name}
                        </h4>

                        <div className="mt-2 space-y-1">
                          {members.length > 0 ? (
                            members.map((member) => (
                              <div
                                key={member.id}
                                className="flex flex-wrap items-center gap-2 text-sm text-gray-600"
                              >
                                <span>
                                  {member.name}
                                </span>

                                {group.leaderId ===
                                  member.id && (
                                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                                      Group Leader
                                    </span>
                                  )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              No members yet
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isSubmitted
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                            }`}
                        >
                          {isSubmitted
                            ? "✓ Submitted"
                            : "Pending"}
                        </span>

                        {groupSubmission?.acknowledgedAt && (
                          <p className="mt-2 text-right text-xs text-gray-500">
                            {formatAcknowledgedAt(
                              groupSubmission.acknowledgedAt
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Students without a group
            </h3>

            <span className="text-xs font-medium text-gray-500">
              {studentsWithoutGroup.length}
            </span>
          </div>

          {studentsWithoutGroup.length === 0 ? (
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-700">
                All enrolled students are in a group.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {studentsWithoutGroup.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {student.name}
                  </span>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    Not in a group
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const studentSubmissions = courseStudents.map((student) => {
    const submission = submissions.find(
      (item) =>
        item.assignmentId === assignment.id &&
        item.studentId === student.id
    )

    return {
      student,
      submission,
      isSubmitted: submission?.status === "submitted",
    }
  })

  const submittedCount = studentSubmissions.filter(
    (item) => item.isSubmitted
  ).length

  const totalStudents = studentSubmissions.length
  const pendingCount = Math.max(
    totalStudents - submittedCount,
    0
  )

  const progress =
    totalStudents === 0
      ? 0
      : Math.round((submittedCount / totalStudents) * 100)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Submission report
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track the acknowledgment status of each student.
          </p>
        </div>

        <span className="text-sm font-semibold text-gray-700">
          {submittedCount} / {totalStudents} students submitted
        </span>
      </div>

      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            {submittedCount} submitted · {pendingCount} pending
          </span>

          <span className="font-medium text-gray-700">
            {progress}%
          </span>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-900">
          Students
        </h3>

        <div className="mt-3 space-y-2">
          {studentSubmissions.map(
            ({ student, submission, isSubmitted }) => (
              <div
                key={student.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {student.name}
                  </p>

                  {isSubmitted &&
                    submission?.acknowledgedAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Acknowledged on{" "}
                        {formatAcknowledgedAt(
                          submission.acknowledgedAt
                        )}
                      </p>
                    )}
                </div>

                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${isSubmitted
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                    }`}
                >
                  {isSubmitted
                    ? "✓ Submitted"
                    : "Pending"}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfessorSubmissionReport