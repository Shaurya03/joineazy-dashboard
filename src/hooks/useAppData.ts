import { useEffect, useState } from "react"

import {
  assignments,
  courses,
  groupMembers,
  groups,
  submissions,
  users,
} from "../data/mockData"

import type {
  Assignment,
  Group,
  GroupMember,
  Submission,
} from "../types"

function useAppData(
  currentUserId: string | null,
  selectedCourseId: string | null
) {
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

  const [groupData, setGroupData] = useState<Group[]>(() => {
    const storedGroups = localStorage.getItem("groups")

    return storedGroups
      ? JSON.parse(storedGroups)
      : groups
  })

  const [groupMemberData, setGroupMemberData] = useState<GroupMember[]>(
    () => {
      const storedMembers = localStorage.getItem("groupMembers")

      return storedMembers
        ? JSON.parse(storedMembers)
        : groupMembers
    }
  )

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

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  )

  const handleCreateGroup = (name: string) => {
    if (
      !currentUser ||
      currentUser.role !== "student" ||
      !selectedCourse
    ) {
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

  const handleAcknowledgeGroupSubmission = (
    assignmentId: string
  ) => {
    if (!currentUser || currentUser.role !== "student") {
      return
    }

    const assignment = assignmentData.find(
      (item) => item.id === assignmentId
    )

    if (
      !assignment ||
      assignment.submissionType !== "group"
    ) {
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

    if (
      !currentGroup ||
      currentGroup.leaderId !== currentUser.id
    ) {
      return
    }

    const groupStudentIds = groupMemberData
      .filter(
        (member) => member.groupId === currentGroup.id
      )
      .map((member) => member.studentId)

    const acknowledgedAt = new Date().toISOString()

    setSubmissionData((currentSubmissions) => {
      const updatedSubmissions: Submission[] =
        currentSubmissions.map(
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

      const missingSubmissions: Submission[] =
        groupStudentIds
          .filter(
            (studentId) =>
              !existingStudentIds.includes(studentId)
          )
          .map((studentId) => ({
            id: `submission-${Date.now()}-${studentId}`,
            assignmentId,
            studentId,
            groupId: currentGroup.id,
            status: "submitted",
            acknowledgedAt,
          }))

      return [
        ...updatedSubmissions,
        ...missingSubmissions,
      ]
    })
  }

  const handleCreateAssignment = (
    assignment: Assignment
  ) => {
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

    const newSubmissions: Submission[] =
      enrolledStudents.map((student) => ({
        id: `submission-${Date.now()}-${student.id}`,
        assignmentId: assignment.id,
        studentId: student.id,
        status: "not-submitted",
      }))

    setSubmissionData((currentSubmissions) => [
      ...currentSubmissions,
      ...newSubmissions,
    ])
  }

  const handleUpdateAssignment = (
    updatedAssignment: Assignment
  ) => {
    setAssignmentData((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === updatedAssignment.id
          ? updatedAssignment
          : assignment
      )
    )
  }

  const handleDeleteAssignment = (
    assignmentId: string
  ) => {
    setAssignmentData((currentAssignments) =>
      currentAssignments.filter(
        (assignment) => assignment.id !== assignmentId
      )
    )

    setSubmissionData((currentSubmissions) =>
      currentSubmissions.filter(
        (submission) =>
          submission.assignmentId !== assignmentId
      )
    )
  }

  return {
    assignmentData,
    submissionData,
    groupData,
    groupMemberData,

    handleCreateGroup,
    handleJoinGroup,
    handleAcknowledgeSubmission,
    handleAcknowledgeGroupSubmission,
    handleCreateAssignment,
    handleUpdateAssignment,
    handleDeleteAssignment,
  }
}

export default useAppData