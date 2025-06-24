import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { RxAvatar } from "react-icons/rx"
import { IoMdSend } from "react-icons/io"
import api from "../utils/axios"
import toast from "react-hot-toast"

export default function CommentSection() {
  const [text, setText] = useState("")
  const { auth } = useAuth()
  const handleComment = async () => {
    try {
      await api.post('/comments', text)
    } catch {
      toast.error("Please check your netwrok connection and try again.")
    }
  }
  return (
    <>
      <div className="mt-10 mx-24">
        <h3 className="text-2xl mb-4">Comments</h3><hr className="text-gray-200" />
        <div className="flex gap-2 items-center">
          <RxAvatar />
          <p className="text-lg my-1">{auth?.user.username}</p>
        </div>
        <div className="flex relative">
          <textarea
            maxLength={300}
            value={text}
            className="w-full p-3 resize-y min-h-[80px] border border-gray-300 rounded-xl mx-4"
            onChange={(e) => setText(e.target.value)} />
          <button className="absolute bottom-2 right-7 cursor-pointer p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600" onClick={handleComment}><IoMdSend /></button>
        </div>
      </div>
    </>
  )
}