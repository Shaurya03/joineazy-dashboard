import type { Course, User } from "../types"

type CourseCardProps = {
  course: Course
  currentUser: User
  onClick: () => void
}

function CourseCard({
  course,
  currentUser,
  onClick,
}: CourseCardProps) {
  const isProfessor = currentUser.role === "admin"

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {course.code}
          </span>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            {course.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {course.semester}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">
            {isProfessor ? "Students" : "Course"}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-800">
            {isProfessor
              ? `${course.studentIds.length} students`
              : "Enrolled"}
          </p>
        </div>

        <span className="text-sm font-medium text-blue-600">
          View course
        </span>
      </div>
    </button>
  )
}

export default CourseCard