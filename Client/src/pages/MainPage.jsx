import React from "react"
import NavBar from "./NavBar"
import { Outlet } from "react-router"
import Footer from "./Footer"
import { Toaster } from "react-hot-toast"

export default function MainPage() {

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </>
  )
}