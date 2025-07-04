import React from "react"
import { useRoadmapContext } from "../context/RoadmapContext"
import { Link } from "react-router-dom"
import { BiUpvote } from "react-icons/bi"

export default function CategoryList() {
  const {
    roadmaps,
    isLoadingRoadmaps,
    roadmapError,
    currentFilters,
    currentSort,
    setFilter,
    setSort,
  } = useRoadmapContext()

  const categories = Array.from(new Set(roadmaps.map(r => r.category)))

  const statuses = ["Not Started", "In Progress", "Completed", "Planned"]

  const getStatusStyle = (status) => {
    switch (status) {
      case "Not Started":
        return "bg-red-100 text-red-700"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-700"
      case "Planned":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 font-inter">
      <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">Developer Roadmaps</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col">
          <label htmlFor="status-filter" className="text-sm font-semibold mb-1 text-gray-600">Status</label>
          <select
            id="status-filter"
            value={currentFilters.status}
            onChange={(e) => setFilter('status', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
          >
            <option value="">All</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="category-filter" className="text-sm font-semibold mb-1 text-gray-600">Category</label>
          <select
            id="category-filter"
            value={currentFilters.category}
            onChange={(e) => setFilter('category', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
          >
            <option value="">All</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="sort-by" className="text-sm font-semibold mb-1 text-gray-600">Sort By</label>
          <select
            id="sort-by"
            value={currentSort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingRoadmaps ? (
          Array(6).fill().map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-40 p-4 shadow-md">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))
        ) : roadmapError ? (
          <div className="col-span-full text-red-500 text-lg text-center">
            {roadmapError}
          </div>
        ) : roadmaps.length > 0 ? (
          roadmaps.map((roadmap) => (
            <div
              key={roadmap._id}
              className="flex flex-col justify-between bg-white shadow-md hover:shadow-xl rounded-xl transition-all duration-200 transform hover:scale-[1.02] border border-violet-200"
            >
              <div className="flex justify-between items-center">
                <Link
                  to={`/roadmap/${roadmap._id}`}
                  className="p-6 text-xl font-semibold text-gray-800 hover:text-violet-600 transition-colors"
                >
                  {roadmap.title || roadmap.slug || "Untitled Roadmap"}
                </Link>
                <span className="flex items-center p-6 gap-1 text-gray-600 font-medium">
                  <BiUpvote/> {roadmap.upvoteCount ?? 0}
                </span>
              </div>

              <div className="flex justify-between items-center px-6 py-3 text-sm bg-gray-50 rounded-b-xl">
                <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full">
                  {roadmap.category}
                </span>
                <span className={`px-3 py-1 rounded-full font-medium ${getStatusStyle(roadmap.status)}`}>
                  {roadmap.status || "Unknown"}
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-500 text-lg text-center py-12">
            No roadmaps found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
