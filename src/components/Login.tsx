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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-lg font-bold text-white shadow-sm">
            J
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Welcome to Joineazy
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your courses and assignments.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Sign in
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter your account details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError("")
                }}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError("")
                }}
                required
                autoComplete="current-password"
                placeholder="Enter password"
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-900/10"
            >
              Sign In
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Demo access
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div>
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Demo Accounts
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Use these accounts to explore the different roles.
              </p>
            </div>

            <div className="space-y-2.5">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {user.email}
                    </p>

                    <span className="mt-1.5 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-600">
                      {user.role}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onLogin(user)}
                    className="shrink-0 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-sm active:scale-[0.98]"
                  >
                    Login
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Demo password:</span>{" "}
                123456
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Joineazy Assignment Management
        </p>
      </div>
    </div>
  )
}

export default Login