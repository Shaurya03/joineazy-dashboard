import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
        </main>
      </div>
    </div>
  )
}

export default App