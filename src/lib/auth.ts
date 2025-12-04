export interface User {
  id: string
  name: string
  email: string
}

export const MOCK_USERS: User[] = [
  { id: 'user_1', name: 'Minh Quân', email: 'minhquan@example.com' },
  { id: 'user_2', name: 'Tuệ Minh', email: 'tueminh@example.com' },
]

export function authenticateUser(email: string): User | null {
  return MOCK_USERS.find(user => user.email === email) || null
}
