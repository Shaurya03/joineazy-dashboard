import { useState } from "react"
import type { User } from "../types"

type LoginProps = {
  users: User[]
  onLogin: (user: User) => void
}

function Login({ users, onLogin }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const user = users.find(
      (user) => user.email === email
    )

    if (!user || password !== "123456") {
      setError("Invalid email or password.")
      return
    }

    setError("")
    onLogin(user)
  }

  const demoUsers = users

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Joineazy Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Sign in to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900">
            Demo Accounts
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Use these accounts to explore different roles.
          </p>

          <div className="mt-3 space-y-2">
            {demoUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>

                  <p className="mt-0.5 text-xs capitalize text-gray-500">
                    {user.role}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onLogin(user)}
                  className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                  Login
                </button>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Demo password: 123456
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login