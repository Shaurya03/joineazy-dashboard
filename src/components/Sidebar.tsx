function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-white md:block">
      <div className="p-6">
        <nav className="space-y-2">
          <button className="w-full rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium text-blue-600">
            Dashboard
          </button>

          <button className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-50">
            Assignments
          </button>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar