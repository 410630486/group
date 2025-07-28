import { User } from '../types/User'

interface UserListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}

const UserList = ({ users, onEdit, onDelete }: UserListProps) => {
  if (users.length === 0) {
    return (
      <div className="user-list">
        <h2>用戶列表</h2>
        <p className="no-users">暫無用戶數據</p>
      </div>
    )
  }

  return (
    <div className="user-list">
      <h2>用戶列表</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>郵箱</th>
              <th>電話</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || '未填寫'}</td>
                <td className="actions">
                  <button
                    onClick={() => onEdit(user)}
                    className="btn btn-secondary btn-sm"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="btn btn-danger btn-sm"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserList
