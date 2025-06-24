import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/axios'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const RoadmapContext = createContext()

const RoadmapProvider = ({ children }) => {
  const [roadmaps, setRoadmaps] = useState([])
  const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(true)
  const [roadmapError, setRoadmapError] = useState(null)
  const { auth, isLoadingAuth } = useAuth()
  
  const [currentFilters, setCurrentFilters] = useState({
    status: '',
    category: ''
  })
  const [currentSort, setCurrentSort] = useState('newest')

  const fetchRoadmaps = useCallback(async () => {
    setIsLoadingRoadmaps(true)
    setRoadmapError(null)
    try {
      const params = new URLSearchParams()
      if (currentFilters.status) {
        params.append('status', currentFilters.status)
      }
      if (currentFilters.category) {
        params.append('category', currentFilters.category)
      }
      if (currentSort) {
        params.append('sort', currentSort)
      }
      const res = await api.get(`/roadmaps?${params.toString()}`)
      if (res.status === 200) {
        setRoadmaps(res.data)
      }
    } catch (error) {
      setRoadmapError(error.response?.data?.message || "Failed to load roadmaps.")
      setRoadmaps([])
    } finally {
      setIsLoadingRoadmaps(false)
    }
  }, [currentFilters, currentSort])
  useEffect(() => {
    if (!isLoadingAuth) {
      fetchRoadmaps()
    }
  }, [isLoadingAuth, fetchRoadmaps])
  const setFilter = (filterType, value) => {
    setCurrentFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }))
  }

  const setSort = (sortOption) => {
    setCurrentSort(sortOption)
  }

  const updateStepStatus = async (roadmapId, newStatus) => {

    if (!auth?.token) {
      toast.error("User not authenticated.")
    }
    try {
      const response = await api.put(
        `/roadmaps/${roadmapId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )
      setRoadmaps(prevRoadmaps =>
        prevRoadmaps.map(rm =>
          rm._id === roadmapId ? { ...rm, status: newStatus } : rm
        )
      )
      return response.data
    } catch (err) {
      console.error("Error updating step status:", err)
      throw err
    }
  }

  const checkUserUpvoteStatus = async (roadmapId) => {
    if (!roadmapId) {
      return false
    }
    if (!auth?.token) {
      return false
    }
    try {
      const response = await api.get(`/upvotes/status?roadmapId=${roadmapId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      return response.data.hasUpvoted
    } catch {
      return false
    }
  }

  const upvoteRoadmap = async (roadmapId) => {
    if (!roadmapId) {
      throw new Error("Missing roadmapId")
    }
    if (!auth?.token) {
      throw new new Error("User not authenticated. Cannot upvote.")
    }
    try {
      const response = await api.put(`/roadmaps/${roadmapId}/upvote`, {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )

      const updatedRoadmap = response.data.roadmap
      setRoadmaps(prevRoadmaps =>
        prevRoadmaps.map(rm =>
          rm._id === roadmapId ? { ...rm, upvoteCount: updatedRoadmap.upvoteCount } : rm
        )
      )
      return response.data
    } catch (error) {
      console.error("Failed to upvote roadmap:", error)
      throw error
    }
  }

  return (
    <RoadmapContext.Provider
      value={{
        roadmaps,
        isLoadingRoadmaps,
        roadmapError,
        currentFilters,
        currentSort,
        setFilter,
        setSort,
        updateStepStatus,
        checkUserUpvoteStatus,
        upvoteRoadmap
      }}>
      {children}
    </RoadmapContext.Provider>
  )
}

export default RoadmapProvider
export const useRoadmapContext = () => useContext(RoadmapContext)
