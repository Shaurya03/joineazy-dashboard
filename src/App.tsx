import { useState } from "react"

import Navbar from "./components/Navbar"
import Login from "./components/Login"
import CourseDashboard from "./components/CourseDashboard"
import CourseAssignments from "./components/CourseAssignments"
import AssignmentDetails from "./components/AssignmentDetails"
import AssignmentForm from "./components/AssignmentForm"

import { courses, users } from "./data/mockData"

import type { Assignment, User } from "./types"

import useAppData from "./hooks/useAppData"

function App() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem("currentUserId")
  })

  const [selectedCourseId, setSelectedCourseId] =
    useState<string | null>(null)

  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState<string | null>(null)

  const [isAssignmentFormOpen, setIsAssignmentFormOpen] =
    useState(false)

  const [assignmentToEdit, setAssignmentToEdit] =
    useState<Assignment | undefined>(undefined)

  const {
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
  } = useAppData(currentUserId, selectedCourseId)

  const currentUser = users.find(
    (user) => user.id === currentUserId
  )

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  )

  const selectedAssignment = assignmentData.find(
    (assignment) => assignment.id === selectedAssignmentId
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
    setIsAssignmentFormOpen(false)
    setAssignmentToEdit(undefined)

    localStorage.removeItem("currentUserId")
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId)
    setSelectedAssignmentId(null)
    setIsAssignmentFormOpen(false)
    setAssignmentToEdit(undefined)
  }

  const handleAssignmentSelect = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId)
    setIsAssignmentFormOpen(false)
    setAssignmentToEdit(undefined)
  }

  const handleEditAssignment = (assignment: Assignment) => {
    setAssignmentToEdit(assignment)
    setIsAssignmentFormOpen(true)
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
            onAcknowledgeGroupSubmission={
              handleAcknowledgeGroupSubmission
            }
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
          />
        ) : selectedCourse ? (
          <>
            {isAssignmentFormOpen &&
              currentUser.role === "admin" && (
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
                setSelectedAssignmentId(null)
                setIsAssignmentFormOpen(false)
                setAssignmentToEdit(undefined)
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