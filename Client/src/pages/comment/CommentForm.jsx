import React from 'react'
import { useEffect } from 'react'
import { useState } from "react"
import toast from 'react-hot-toast'

export default function CommentForm({ initialContent = '', onSubmit, submitLabel = 'Submit', onCancel }) {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim().length === 0) {
      toast.error("Comment cannot be empty!")
      return
    }
    if (content.trim().length > 300) {
      toast.error("Comment cannot exceed 300 characters!")
      return
    }
    onSubmit(content.trim())
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={300}
        rows="3"
        placeholder="Write your comment..."
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        aria-label="Comment content"
      />
      <div className="flex justify-end gap-2 mt-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
