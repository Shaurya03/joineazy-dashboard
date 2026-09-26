import type { User } from "../types"

type UserSwitcherProps = {
  users: User[]
  currentUserId: string
  onUserChange: (userId: string) => void
}

function UserSwitcher({
  users,
  currentUserId,
  onUserChange,
}: UserSwitcherProps) {
  return (
    <select
      value={currentUserId}
      onChange={(event) => onUserChange(event.target.value)}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
    >
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name} ({user.role})
        </option>
      ))}
    </select>
  )
}

export default UserSwitcher