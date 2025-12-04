export interface User {
  id: string
  name: string
  email: string
}

export const MOCK_USERS: User[] = [
  { id: 'user_1', name: 'Minh Quân', email: 'minhquan@example.com' },
  { id: 'user_2', name: 'Hồng Anh', email: 'honganh@example.com' },
  { id: 'user_3', name: 'Tuấn Kiệt', email: 'tuankiet@example.com' },
  { id: 'user_4', name: 'Thu Hà', email: 'thuha@example.com' },
]

export function authenticateUser(email: string): User | null {
  return MOCK_USERS.find(user => user.email === email) || null
}
