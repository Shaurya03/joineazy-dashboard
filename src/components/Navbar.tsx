type NavbarProps = {
  onLogout: () => void
}

function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold text-gray-900">
        Joineazy
      </h1>

      <button
        type="button"
        onClick={onLogout}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar