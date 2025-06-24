import { Navigate } from "react-router-dom"
import { useAuth } from "/src/context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { auth, isLoadingAuth } = useAuth()
  const Token=localStorage.getItem("token")
  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading authentication...
      </div>
    )
  }
  if (!auth) {
    return <Navigate to="/signin" replace />
  }
  return  children 
}

export default PrivateRoute