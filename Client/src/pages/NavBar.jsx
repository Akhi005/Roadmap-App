import React, { useState } from 'react'
import Logo from '../components/common/Logo'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { IoHome } from "react-icons/io5"

export default function NavBar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const authDataString = localStorage.getItem("auth")
  const authDataObject = JSON.parse(authDataString)
  const username = authDataObject.user.username
  const { auth, logout } = useAuth()
  const handleDropDown = () => {
    setIsOpen(!isOpen)
  }
  const handleSignOut = () => {
    logout()
    navigate('/')
  }
  return (
    <>
      <nav className="flex w-full justify-around px-5 h-28 items-center text-xl bg-[#f5f0ff]">
        <Link to='/roadmap' className="flex items-center gap-2 text-violet-700 font-semibold text-2xl" onClick={handleDropDown}>
          <IoHome /> Start Here
        </Link>
        <Logo width={220} />
        <div className="flex gap-2 items-center">
          <p className=" ">{auth?.username ?? username}</p>
          <button onClick={handleSignOut} className="text-white bg-blue-800  rounded-xl px-3 py-2 cursor-pointer">Sign Out</button>
        </div>
      </nav>
    </>
  )
}