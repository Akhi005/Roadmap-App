import { useEffect, useState } from 'react'
import Comment from './Comment'
import CommentForm from './CommentForm'
import api from '/src/utils/axios'
import { useAuth } from '../../context/AuthContext'

function buildCommentTree(flatComments) {
  if (!Array.isArray(flatComments)) return []
  const map = {}, roots = []

  flatComments.forEach(e => {
    e.replies = []
    map[e._id?.toString()] = e
  })

  flatComments.forEach(e => {
    const parentId = e.parentId
    if (parentId !== null && parentId !== undefined && parentId !== '') {
      const parent = map[parentId?.toString()]
      if (parent) {
        parent.replies.push(e)
      }
    } else {
      roots.push(e)
    }
  })
  return roots
}

export default function CommentList({ roadmapId }) {
  const [comments, setComments] = useState([])
  const { auth } = useAuth()
  useEffect(() => {
    fetchComments()
  }, [roadmapId])

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${roadmapId}`)
      if (res.status === 200) {
        setComments(Array.isArray(res.data) ? res.data : [])
      }
    } catch {
      setComments([])
    }
  }
  const addComment = async (content, parentId = null) => {
    await api.post('/comments', { roadmapId, content, parentId }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    fetchComments()
  }
  const editComment = async (id, content) => {
    await api.put(`/comments/${id}`, { content }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    fetchComments()
  }
  const deleteComment = async (id) => {
    await api.delete(`/comments/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    fetchComments()
  }
  const commentTree = buildCommentTree(comments)

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      <CommentForm onSubmit={(content) => addComment(content)} />
      {commentTree.map(comment => (
        <Comment
          key={comment._id}
          comment={comment}
          replies={comment.replies}
          depth={0}
          onReply={addComment}
          onEdit={editComment}
          onDelete={deleteComment}
          currentUserId={auth?.user?._id}
        />
      ))
      }
    </div>
  )
}
