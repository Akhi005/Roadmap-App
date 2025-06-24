import React from 'react'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import api from '../../utils/axios'

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
  const password = watch("password")

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setServerError("")

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmpassword, ...signupData } = data
      const res = await api.post(`/auth/signup`, signupData)
      localStorage.setItem("username", res.data.username)
      localStorage.setItem("useremail", res.data.email)
      navigate('/roadmap')
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again."
      setServerError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border border-3 border-gray-200 rounded-xl bg-gray-300 w-full px-12 py-8 mb-8">
      <h2 className="text-3xl text-center font-bold mb-2">Sign Up</h2>
      {serverError && <p className="text-red-600 text-center py-2">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <div>
          <label className="text-xl">Username</label>
          <input
            className="bg-gray-200 w-full p-3 my-2 rounded-xl"
            {...register("username", { required: true, minLength: 4 })}
          />
          {errors.username && (
            <span className="text-red-500">
              {errors.username.type === "minLength"
                ? "Username must be at least 4 characters"
                : "Username is required"}
            </span>
          )}
        </div>
        <div>
          <label className="text-xl">Email</label>
          <input
            type="email"
            className="bg-gray-200 w-full p-3 my-2 rounded-xl"
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
          />
          {errors.email && (
            <span className="text-red-500">
              {errors.email.type === "pattern"
                ? "Please enter a valid email"
                : "Email is required"}
            </span>
          )}
        </div>
        <div>
          <label className="text-xl">Password</label>
          <input
            type="password"
            className="bg-gray-200 w-full p-3 my-2 rounded-xl"
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password && (
            <span className="text-red-500">
              {errors.password.type === "minLength"
                ? "Password must be at least 6 characters"
                : "Password is required"}
            </span>
          )}
        </div>
        <div>
          <label className="text-xl">Confirm Password</label>
          <input
            type="password"
            className="bg-gray-200 w-full p-3 my-2 rounded-xl"
            {...register("confirmpassword", {
              required: true,
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmpassword && (
            <span className="text-red-500">
              {errors.confirmpassword.message ||
                "Confirm Password is required"}
            </span>
          )}
        </div>
        <button
          disabled={isSubmitting}
          className={`w-full my-4 font-semibold p-2 rounded-2xl text-xl cursor-pointer text-white ${isSubmitting ? 'bg-gray-500' : 'bg-blue-700 hover:bg-blue-500'
            }`}
          type="submit"
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <div className="flex">
        <p className="text-lg">Already have an account?</p>
        <Link to="/signin">
          <span className="font-bold text-xl mx-1">Login</span>
        </Link>
      </div>
    </div>
  )
}