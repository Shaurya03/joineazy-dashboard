type NavbarProps = {
  onLogout: () => void
}

function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white shadow-sm">
            J
          </div>

          <div>
            <h1 className="text-base font-bold tracking-tight text-gray-900">
              Joineazy
            </h1>

            <p className="hidden text-[11px] font-medium text-gray-400 sm:block">
              Assignment Management
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar