import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'

export default function SignInForm() {
  const [serverError, setServerError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setServerError("")
    const { email, password } = data
    try {
      const res = await login(email, password)
      if (res) {
        navigate('/roadmap')
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again."
      setServerError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex justify-center px-4 sm:px-0">
      <div className="rounded-xl bg-gray-200 w-full max-w-md p-6 sm:p-10 my-12 sm:my-16 shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl text-center font-bold mb-6 sm:mb-8">Login</h2>

          {serverError && <p className='text-red-500 text-center mb-4'>{serverError}</p>}

          <div>
            <label className="text-lg">Email</label>
            <input
              className="bg-white w-full p-3 mt-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.type === "required" ? "Email is required" : "Please enter a valid email"}
              </span>
            )}
          </div>
          <div>
            <label className="text-lg">Password</label>
            <input
              type="password"
              className="bg-white w-full p-3 mt-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.type === "minLength"
                  ? "Password must be at least 6 characters"
                  : "Password is required"}
              </span>
            )}
          </div>
          <button
            disabled={isSubmitting}
            className={`w-full mt-6 font-semibold p-3 rounded-2xl text-lg sm:text-xl transition-colors duration-200 text-white 
              ${isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              }`}
            type="submit"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="flex justify-center items-center mt-6">
          <p className="text-base sm:text-lg">Don't have an account?</p>
          <Link to="/">
            <span className="font-bold text-blue-700 text-lg sm:text-xl ml-2 hover:underline">Signup</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
