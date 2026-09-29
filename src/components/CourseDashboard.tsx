import type { Course, User } from "../types"
import CourseCard from "./CourseCard"

type CourseDashboardProps = {
  currentUser: User
  courses: Course[]
  onCourseSelect: (courseId: string) => void
}

function CourseDashboard({
  currentUser,
  courses,
  onCourseSelect,
}: CourseDashboardProps) {
  const visibleCourses =
    currentUser.role === "admin"
      ? courses.filter(
        (course) => course.professorId === currentUser.id
      )
      : courses.filter((course) =>
        course.studentIds.includes(currentUser.id)
      )

  const isProfessor = currentUser.role === "admin"

  return (
    <div>
      <div className="mb-8">
        <div>
          <p className="text-sm font-medium text-blue-600">
            {isProfessor ? "Professor workspace" : "Student workspace"}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            {isProfessor ? "My Courses" : "My Learning"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {isProfessor
              ? "Manage your courses, assignments, and student progress."
              : "Access your courses and keep track of upcoming assignments."}
          </p>
        </div>
      </div>

      {visibleCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No courses yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Courses assigned to your account will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              currentUser={currentUser}
              onClick={() => onCourseSelect(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseDashboard