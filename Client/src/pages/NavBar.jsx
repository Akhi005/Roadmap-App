import React, { useState } from 'react'
import Logo from '../components/common/Logo'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IoHome } from "react-icons/io5"
import { HiMenu, HiX } from "react-icons/hi"

export default function NavBar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const authDataString = localStorage.getItem("auth")
  const authDataObject = authDataString ? JSON.parse(authDataString) : {}
  const username = authDataObject?.user?.username

  const { auth, logout } = useAuth()

  const handleDropDown = () => {
    setIsOpen(!isOpen)
  }

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-[#f5f0ff] px-4 py-4 shadow-md h-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="text-3xl lg:hidden cursor-pointer" onClick={handleDropDown}>
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
          <Link to="/roadmap" className="flex items-center gap-2 text-violet-700 font-semibold text-xl sm:text-2xl">
            <IoHome /> <span className="hidden sm:inline">Start Here</span>
          </Link>
        </div>

        <div className="hidden lg:flex justify-center">
          <Logo width={180}/>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <p className="text-sm sm:text-base">{auth?.username ?? username}</p>
          <button
            onClick={handleSignOut}
            className="text-white bg-blue-800 rounded-xl px-4 py-2 text-sm sm:text-base cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden mt-4 flex flex-col items-start gap-4 px-4">
          <Logo width={220} />
          <p className="text-sm">{auth?.username ?? username}</p>
          <button
            onClick={handleSignOut}
            className="text-white bg-blue-800 rounded-xl px-4 cursor-pointer py-2 text-sm"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  )
}
