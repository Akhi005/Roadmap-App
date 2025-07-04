import { useState } from "react"
import CommentForm from "./CommentForm"
import { RxAvatar } from "react-icons/rx"
import toast from "react-hot-toast"

export default function Comment({
  comment,
  replies = [],
  depth = 0,
  onReply,
  onEdit,
  onDelete,
  currentUserId
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const isAuthor = currentUserId === (comment.user?._id || comment.userId)

  const handleEditSubmit = (content) => {
    onEdit(comment._id, content)
    setIsEditing(false)
  }

  const handleReplySubmit = (content) => {
    onReply(content, comment._id)
    setIsReplying(false)
  }

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      onDelete(comment._id)
    }
  }

  const toggleReply = () => {
    if (depth >= 3) {
      toast.error("A comment can have a maximum of 3 replies.")
      return
    }
    setIsReplying(prev => !prev)
    if (isEditing) setIsEditing(false)
  }

  const toggleEdit = () => {
    setIsEditing(prev => !prev)
    if (isReplying) setIsReplying(false)
  }

  const formattedDate = new Date(comment.createdAt).toLocaleString()

  return (
    <div
      className={`mt-4 px-2 sm:px-6 text-base sm:text-lg ${depth > 0 ? `pl-${Math.min(depth * 4, 12)}` : ''
        }`}
    >
      <div className="flex gap-2 items-center mb-2">
        <RxAvatar className="text-2xl" />
        <p className="text-sm sm:text-base font-semibold text-gray-700 break-words">
          {comment.user?.username || "Anonymous User"}
          <span className="block sm:inline text-xs sm:text-sm text-gray-500 ml-0 sm:ml-2">{formattedDate}</span>
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg bg-gray-100 shadow-sm p-3 sm:ml-12">
        {isEditing ? (
          <CommentForm
            initialContent={comment.content}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
            submitLabel="Update Comment"
          />
        ) : (
          <p className="mt-1 text-gray-800 break-words">{comment.content}</p>
        )}

        <div className="text-sm font-bold mt-2 flex gap-6 text-blue-600 flex-wrap">
          <button
            className="cursor-pointer"
            onClick={toggleReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply to comment"}
          >
            {isReplying ? "Cancel" : "Reply"}
          </button>

          {isAuthor && (
            <>
              <button
                className="cursor-pointer"
                onClick={toggleEdit}
                aria-label={isEditing ? "Cancel Edit" : "Edit comment"}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button
                className="cursor-pointer"
                onClick={handleDeleteClick}
                aria-label="Delete comment"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {isReplying && depth < 3 && (
        <div className="mt-2 sm:ml-12">
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            submitLabel="Reply"
          />
        </div>
      )}

      {replies.length > 0 && replies.map((reply) => (
        <Comment
          key={reply._id}
          comment={reply}
          replies={reply.replies}
          depth={depth + 1}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}
