import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import CourseDashboard from "./components/CourseDashboard"
import CourseAssignments from "./components/CourseAssignments"
import AssignmentDetails from "./components/AssignmentDetails"
import AssignmentForm from "./components/AssignmentForm"
import { courses, assignments, submissions, users, groups, groupMembers } from "./data/mockData"
import type { Assignment, Submission, User, Group, GroupMember } from "./types"

function App() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem("currentUserId")
  })

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null)

  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false)

  const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | undefined>(undefined)

  const [assignmentData, setAssignmentData] = useState<Assignment[]>(() => {
    const storedAssignments = localStorage.getItem("assignments")

    return storedAssignments
      ? JSON.parse(storedAssignments)
      : assignments
  })

  const [submissionData, setSubmissionData] = useState<Submission[]>(() => {
    const storedSubmissions = localStorage.getItem("submissions")

    return storedSubmissions
      ? JSON.parse(storedSubmissions)
      : submissions
  })

  useEffect(() => {
    localStorage.setItem(
      "assignments",
      JSON.stringify(assignmentData)
    )
  }, [assignmentData])

  useEffect(() => {
    localStorage.setItem(
      "submissions",
      JSON.stringify(submissionData)
    )
  }, [submissionData])

  const [groupData, setGroupData] = useState<Group[]>(() => {
    const storedGroups = localStorage.getItem("groups")

    return storedGroups
      ? JSON.parse(storedGroups)
      : groups
  })

  const [groupMemberData, setGroupMemberData] =
    useState<GroupMember[]>(() => {
      const storedMembers =
        localStorage.getItem("groupMembers")

      return storedMembers
        ? JSON.parse(storedMembers)
        : groupMembers
    })

  useEffect(() => {
    localStorage.setItem(
      "groups",
      JSON.stringify(groupData)
    )
  }, [groupData])

  useEffect(() => {
    localStorage.setItem(
      "groupMembers",
      JSON.stringify(groupMemberData)
    )
  }, [groupMemberData])

  const currentUser = users.find(
    (user) => user.id === currentUserId
  )

  const handleLogin = (user: User) => {
    setCurrentUserId(user.id)
    setSelectedCourseId(null)
    setSelectedAssignmentId(null)

    localStorage.setItem("currentUserId", user.id)
  }

  const handleLogout = () => {
    setCurrentUserId(null)
    setSelectedCourseId(null)
    setSelectedAssignmentId(null)

    localStorage.removeItem("currentUserId")
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId)
  }

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  )

  const handleCreateGroup = (name: string) => {
    if (!currentUser || currentUser.role !== "student" || !selectedCourse) {
      return
    }

    const groupId = `group-${Date.now()}`

    const newGroup: Group = {
      id: groupId,
      courseId: selectedCourse.id,
      name,
      leaderId: currentUser.id,
    }

    const newMember: GroupMember = {
      groupId,
      studentId: currentUser.id,
    }

    setGroupData((currentGroups) => [
      ...currentGroups,
      newGroup,
    ])

    setGroupMemberData((currentMembers) => [
      ...currentMembers,
      newMember,
    ])
  }

  const handleJoinGroup = (groupId: string) => {
    if (!currentUser || currentUser.role !== "student") {
      return
    }

    const alreadyMember = groupMemberData.some(
      (member) =>
        member.groupId === groupId &&
        member.studentId === currentUser.id
    )

    if (alreadyMember) {
      return
    }

    setGroupMemberData((currentMembers) => [
      ...currentMembers,
      {
        groupId,
        studentId: currentUser.id,
      },
    ])
  }

  const handleAssignmentSelect = (
    assignmentId: string
  ) => {
    setSelectedAssignmentId(assignmentId)
  }

  const selectedAssignment = assignmentData.find(
    (assignment) => assignment.id === selectedAssignmentId
  )

  const handleAcknowledgeSubmission = (
    assignmentId: string
  ) => {
    setSubmissionData((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission.assignmentId === assignmentId &&
          submission.studentId === currentUserId
          ? {
            ...submission,
            status: "submitted",
            acknowledgedAt: new Date().toISOString(),
          }
          : submission
      )
    )
  }

  const handleAcknowledgeGroupSubmission = (assignmentId: string) => {
    if (!currentUser || currentUser.role !== "student") {
      return
    }

    const assignment = assignmentData.find(
      (item) => item.id === assignmentId
    )

    if (!assignment || assignment.submissionType !== "group") {
      return
    }

    const currentMembership = groupMemberData.find(
      (member) =>
        member.studentId === currentUser.id &&
        groupData.some(
          (group) =>
            group.id === member.groupId &&
            group.courseId === assignment.courseId
        )
    )

    if (!currentMembership) {
      return
    }

    const currentGroup = groupData.find(
      (group) => group.id === currentMembership.groupId
    )

    if (!currentGroup || currentGroup.leaderId !== currentUser.id) {
      return
    }

    const groupStudentIds = groupMemberData
      .filter((member) => member.groupId === currentGroup.id)
      .map((member) => member.studentId)

    const acknowledgedAt = new Date().toISOString()

    setSubmissionData((currentSubmissions) => {
      const updatedSubmissions: Submission[] = currentSubmissions.map(
        (submission): Submission =>
          submission.assignmentId === assignmentId &&
            submission.groupId === currentGroup.id &&
            groupStudentIds.includes(submission.studentId)
            ? {
              ...submission,
              status: "submitted",
              acknowledgedAt,
            }
            : submission
      )

      const existingStudentIds = updatedSubmissions
        .filter(
          (submission) =>
            submission.assignmentId === assignmentId &&
            submission.groupId === currentGroup.id
        )
        .map((submission) => submission.studentId)

      const missingSubmissions: Submission[] = groupStudentIds
        .filter((studentId) => !existingStudentIds.includes(studentId))
        .map((studentId) => ({
          id: `submission-${Date.now()}-${studentId}`,
          assignmentId,
          studentId,
          groupId: currentGroup.id,
          status: "submitted",
          acknowledgedAt,
        }))
      return [...updatedSubmissions, ...missingSubmissions]
    })
  }

  const handleCreateAssignment = (assignment: Assignment) => {
    setAssignmentData((currentAssignments) => [
      ...currentAssignments,
      assignment,
    ])

    if (assignment.submissionType === "group") {
      return
    }

    const course = courses.find(
      (course) => course.id === assignment.courseId
    )

    if (!course) {
      return
    }

    const enrolledStudents = users.filter(
      (user) =>
        user.role === "student" &&
        course.studentIds.includes(user.id)
    )

    const newSubmissions: Submission[] = enrolledStudents.map(
      (student) => ({
        id: `submission-${Date.now()}-${student.id}`,
        assignmentId: assignment.id,
        studentId: student.id,
        status: "not-submitted",
      })
    )

    setSubmissionData((currentSubmissions) => [
      ...currentSubmissions,
      ...newSubmissions,
    ])
  }

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignmentData((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === updatedAssignment.id
          ? updatedAssignment
          : assignment
      )
    )
  }

  const handleEditAssignment = (assignment: Assignment) => {
    setAssignmentToEdit(assignment)
    setIsAssignmentFormOpen(true)
  }

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignmentData((currentAssignments) =>
      currentAssignments.filter(
        (assignment) => assignment.id !== assignmentId
      )
    )

    setSubmissionData((currentSubmissions) =>
      currentSubmissions.filter(
        (submission) => submission.assignmentId !== assignmentId
      )
    )
  }

  const handleConfirmSubmission = (assignmentId: string) => {
    setSubmissionData((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission.assignmentId === assignmentId &&
          submission.studentId === currentUserId
          ? {
            ...submission,
            status: "submitted",
            submittedAt: new Date().toISOString(),
          }
          : submission
      )
    )
  }

  if (!currentUser) {
    return (
      <Login
        users={users}
        onLogin={handleLogin}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl p-6">
        {selectedCourse && selectedAssignment ? (
          <AssignmentDetails
            currentUser={currentUser}
            assignment={selectedAssignment}
            course={selectedCourse}
            submissions={submissionData}
            groups={groupData}
            groupMembers={groupMemberData}
            users={users}
            onBack={() => setSelectedAssignmentId(null)}
            onAcknowledge={handleAcknowledgeSubmission}
            onAcknowledgeGroupSubmission={handleAcknowledgeGroupSubmission}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
          />
        ) : selectedCourse ? (
          <>
            {isAssignmentFormOpen && currentUser.role === "admin" && (
              <AssignmentForm
                currentUserId={currentUser.id}
                courseId={selectedCourse.id}
                assignmentToEdit={assignmentToEdit}
                onCreateAssignment={(assignment) => {
                  handleCreateAssignment(assignment)
                  setIsAssignmentFormOpen(false)
                  setAssignmentToEdit(undefined)
                }}
                onUpdateAssignment={(assignment) => {
                  handleUpdateAssignment(assignment)
                  setIsAssignmentFormOpen(false)
                  setAssignmentToEdit(undefined)
                }}
                onCancel={() => {
                  setIsAssignmentFormOpen(false)
                  setAssignmentToEdit(undefined)
                }}
              />
            )}

            <CourseAssignments
              currentUser={currentUser}
              course={selectedCourse}
              assignments={assignmentData}
              submissions={submissionData}
              onBack={() => {
                setSelectedCourseId(null)
                setIsAssignmentFormOpen(false)
              }}
              onAssignmentSelect={handleAssignmentSelect}
              onCreateAssignment={() => {
                setAssignmentToEdit(undefined)
                setIsAssignmentFormOpen(true)
              }}
              onEditAssignment={handleEditAssignment}
              onDeleteAssignment={handleDeleteAssignment}
            />
          </>
        ) : (
          <CourseDashboard
            currentUser={currentUser}
            courses={courses}
            onCourseSelect={handleCourseSelect}
          />
        )}
      </main>
    </div>
  )
}

export default App