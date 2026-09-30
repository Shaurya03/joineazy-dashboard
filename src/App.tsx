import { useEffect, useState } from "react"

import Navbar from "./components/Navbar"
import Login from "./components/Login"
import CourseDashboard from "./components/CourseDashboard"
import CourseAssignments from "./components/CourseAssignments"
import AssignmentDetails from "./components/AssignmentDetails"
import AssignmentForm from "./components/AssignmentForm"
import Toast from "./components/Toast"

import { courses, users } from "./data/mockData"

import type { Assignment, User } from "./types"

import useAppData from "./hooks/useAppData"

type ToastState = {
  message: string
  type: "success" | "error"
}

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

  const [toast, setToast] = useState<ToastState | null>(null)

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

  useEffect(() => {
    if (!toast) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null)
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [toast])

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({
      message,
      type,
    })
  }

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

  const handleCreateGroupWithToast = (name: string) => {
    handleCreateGroup(name)
    showToast("Group created successfully")
  }

  const handleJoinGroupWithToast = (groupId: string) => {
    handleJoinGroup(groupId)
    showToast("Joined group successfully")
  }

  const handleAcknowledgeSubmissionWithToast = (
    assignmentId: string
  ) => {
    handleAcknowledgeSubmission(assignmentId)
    showToast("Assignment acknowledged")
  }

  const handleAcknowledgeGroupSubmissionWithToast = (
    assignmentId: string
  ) => {
    handleAcknowledgeGroupSubmission(assignmentId)
    showToast("Group assignment acknowledged")
  }

  const handleDeleteAssignmentWithToast = (
    assignmentId: string
  ) => {
    handleDeleteAssignment(assignmentId)
    showToast("Assignment deleted successfully")
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
            onAcknowledge={handleAcknowledgeSubmissionWithToast}
            onAcknowledgeGroupSubmission={
              handleAcknowledgeGroupSubmissionWithToast
            }
            onCreateGroup={handleCreateGroupWithToast}
            onJoinGroup={handleJoinGroupWithToast}
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
                    showToast("Assignment created successfully")
                  }}
                  onUpdateAssignment={(assignment) => {
                    handleUpdateAssignment(assignment)
                    showToast("Assignment updated successfully")
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
              groups={groupData}
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
              onDeleteAssignment={handleDeleteAssignmentWithToast}
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default App