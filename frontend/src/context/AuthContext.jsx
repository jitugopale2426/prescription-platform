import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  )
  const [role, setRole] = useState(
    localStorage.getItem("role") || null
  )

  const login = (userData, userRole, token) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("role", userRole)
    localStorage.setItem("token", token)
    setUser(userData)
    setRole(userRole)
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    localStorage.removeItem("token")
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)