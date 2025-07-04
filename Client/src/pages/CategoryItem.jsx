import React, { useState, useEffect } from "react"
import { useRoadmapContext } from "/src/context/RoadmapContext"
import { useParams } from "react-router-dom"
import { BiUpvote, BiSolidUpvote } from "react-icons/bi"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import CommentList from "./comment/CommentList"
import StepDescription from "../components/MarkDownDescription"

export default function CategoryItem() {
  const { roadmaps, upvoteRoadmap, updateStepStatus, checkUserUpvoteStatus } = useRoadmapContext()
  const { id } = useParams()
  const { auth } = useAuth()
  const [selectedStep, setSelectedStep] = useState(null)
  const [upvoted, setUpvoted] = useState()
  const categoryItem = roadmaps.find((e) => e._id === id)

  useEffect(() => {
    const fetchUpvoteStatus = async () => {
      if (categoryItem && auth?.user?._id) {
        const hasUpvoted = await checkUserUpvoteStatus(categoryItem._id, auth.user._id)
        setUpvoted(hasUpvoted)
      } else {
        setUpvoted(false)
      }
    }
    fetchUpvoteStatus()
  }, [categoryItem, auth?.user?._id, checkUserUpvoteStatus])

  const handleUpvote = async () => {
    if (upvoted) return toast.error("Already upvoted roadmap")
    try {
      await upvoteRoadmap(categoryItem._id, auth?.user?._Id)
      setUpvoted(true)
    } catch {
      setUpvoted(false)
    }
  }
  const UpvoteButton = () => {
    const displayUpvoteCount = categoryItem ? categoryItem.upvoteCount : 0
    return (
      <button
        className={`flex items-center gap-2 cursor-pointer my-5 font-semibold pt-5 text-xl ${upvoted ? "disabled:cursor-not-allowed" : ""}`}
        onClick={handleUpvote}
        disabled={upvoted} >
        {upvoted ? (
          <>
            <BiSolidUpvote className="text-gray-400" />
            <p className="text-gray-400">Upvoted ({displayUpvoteCount})</p>
          </>
        ) : (
          <>
            <BiUpvote />
            Upvote ({displayUpvoteCount})
          </>
        )}
      </button>
    )
  }

  if (!categoryItem) {
    return <p className="text-center p-10">Loading...</p>
  }
  const handleStepClick = (step) => {
    setSelectedStep(step)
  }
  const handleStatusChange = async (event, itemId) => {
    const newStatus = event.target.value
    try {
      await updateStepStatus(itemId, newStatus)
    } catch (error) {
      console.error("Failed to update step status:", error)
    }
  }

  return (
    <div className="p-4 text-xl">
      <h2 className="text-4xl text-center py-5 font-bold mb-2">
        {categoryItem.title}
      </h2>

      <div className="w-full flex justify-end">
        <select
          className="border-3 border-gray-400 p-2 rounded-xl mr-12"
          value={categoryItem.status || ""}
          onChange={(e) => handleStatusChange(e, categoryItem._id)}
        >
          <option value="">Select Progress</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Planned">Planned</option>
        </select>

      </div>
      <div className="flex w-full h-full justify-center items-start gap-24 px-12 mb-24">
        <div>
          <h3 className="text-xl font-semibold mb-3">Steps:</h3>
          <ul className="list-disc list-inside space-y-5 border-2 p-8 rounded-xl w-84 border-violet-300">
            {categoryItem.steps.map((step, index) => (
              <li
                key={step.id || index}
                onClick={() => handleStepClick(step)}
                className="cursor-pointer hover:text-blue-600"
              >
                {step.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-2 p-12 rounded-xl mt-10 border-violet-300 w-full h-full">
          {!selectedStep ? (
            <>
              <div className="flex gap-4 mb-12">
                {categoryItem.tags.map((e, index) => (
                  <p
                    key={index}
                    className="text-white bg-gray-500 px-4 py-2 rounded-full"
                  >
                    {e}
                  </p>
                ))}
              </div>
              <p className="mb-6">{categoryItem.description}</p>
            </>
          ) : (
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                Learn {selectedStep.title}
              </h3>
              <p className="my-5">
                This is where you can find more detailed content or tutorials
                for: <strong>{selectedStep.title}</strong>.
              </p>
              <p className="my-5"><StepDescription description={selectedStep.description} /></p>
            </div>
          )}
          <UpvoteButton />
        </div>
      </div>
      <CommentList roadmapId={categoryItem._id} />
    </div>
  )
}