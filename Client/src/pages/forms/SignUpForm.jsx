import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'

export default function SignUpForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()
  const [serverError, setServerError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signup } = useAuth()
  const password = watch("password")

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setServerError("")
    try {
      const res = await signup(data.username, data.email, data.password)
      if (res) {
        navigate('/roadmap')
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again."
      setServerError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex justify-center px-4 sm:px-0">
      <div className="w-full max-w-md bg-gray-100 border border-gray-200 rounded-xl px-6 sm:px-10 py-8 sm:py-12 my-12 shadow-md">
        <h2 className="text-2xl sm:text-3xl text-center font-bold mb-4 sm:mb-6">Sign Up</h2>
        {serverError && (
          <p className="text-red-600 text-center py-2">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div>
            <label className="text-lg">Username</label>
            <input
              className="bg-white w-full p-3 mt-1 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("username", { required: true, minLength: 4 })}
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.type === "minLength"
                  ? "Username must be at least 4 characters"
                  : "Username is required"}
              </span>
            )}
          </div>
          <div>
            <label className="text-lg">Email</label>
            <input
              type="email"
              className="bg-white w-full p-3 mt-1 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.type === "pattern"
                  ? "Please enter a valid email"
                  : "Email is required"}
              </span>
            )}
          </div>
          <div>
            <label className="text-lg">Password</label>
            <input
              type="password"
              className="bg-white w-full p-3 mt-1 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div>
            <label className="text-lg">Confirm Password</label>
            <input
              type="password"
              className="bg-white w-full p-3 mt-1 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("confirmpassword", {
                required: true,
                validate: (value) =>
                  value === password || "Passwords do not match"
              })}
            />
            {errors.confirmpassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmpassword.message ||
                  "Confirm Password is required"}
              </span>
            )}
          </div>
          <button
            disabled={isSubmitting}
            className={`w-full mt-6 font-semibold p-3 rounded-2xl text-lg sm:text-xl text-white transition-colors duration-200
              ${isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'}`}
            type="submit"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="flex justify-center items-center mt-6">
          <p className="text-base sm:text-lg">Already have an account?</p>
          <Link to="/signin">
            <span className="font-bold text-blue-700 text-lg sm:text-xl ml-2 hover:underline">Login</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
