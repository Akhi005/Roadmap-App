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
    <div className="border border-3 border-gray-200 rounded-xl bg-gray-300 w-full p-12 my-16">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <h2 className="text-3xl text-center font-bold mb-8">Login</h2>
        {serverError && <p className='text-red-500 text-center mb-4'>{serverError}</p>}
        <div>
          <label className="text-xl">Email</label>
          <input
            className=" bg-gray-200 w-full p-3 my-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email.type === "required" ? "Email is required" : "Please enter a valid email"}
            </span>
          )}
        </div>
        <div>
          <label className="text-xl">Password</label>
          <input
            type="password"
            className=" bg-gray-200 w-full p-3 my-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className={`w-full my-4 font-semibold p-3 rounded-2xl text-xl cursor-pointer transition-colors duration-200 ease-in-out text-white ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            }`}
          type="submit"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <div className="flex justify-center items-center mt-4">
        <p className="text-lg">Don't have an account?</p>
        <Link to="/">
          <span className="font-bold text-xl mx-1 text-blue-700 hover:underline">Signup</span>
        </Link>
      </div>
    </div>
  )
}
