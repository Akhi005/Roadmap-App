import React from "react"
import { useRoadmapContext } from "../context/RoadmapContext"
import { Link } from "react-router-dom"

export default function CategoryList() {
  const {
    roadmaps,
    isLoadingRoadmaps,
    roadmapError,
    currentFilters,
    currentSort,
    setFilter,
    setSort
  } = useRoadmapContext()

  const allCategories = roadmaps.map(roadmap => roadmap.category)
  const uniqueCategoriesSet = new Set(allCategories)
  const categories = Array.from(uniqueCategoriesSet)

  const statuses = [
    "Not Started",
    "In Progress",
    "Completed",
    "Planned"
  ]

  return (
    <div className="container mx-auto p-4 font-inter">
      <h2 className="my-16 text-6xl font-bold text-center text-gray-800">Developer Roadmaps</h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12 p-4 bg-white rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <label htmlFor="status-filter" className="text-lg font-medium text-gray-700">Filter by Status:</label>
          <select
            id="status-filter"
            value={currentFilters.status}
            onChange={(e) => setFilter('status', e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <label htmlFor="category-filter" className="text-lg font-medium text-gray-700">Filter by Category:</label>
          <select
            id="category-filter"
            value={currentFilters.category}
            onChange={(e) => setFilter('category', e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <label htmlFor="sort-by" className="text-lg font-medium text-gray-700">Sort By:</label>
          <select
            id="sort-by"
            value={currentSort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap w-full gap-8 px-4 justify-center py-8">
        {isLoadingRoadmaps ? (
          <p className="text-2xl text-gray-600">Loading roadmaps...</p>
        ) : roadmapError ? (
          <p className="text-2xl text-red-500">{roadmapError}</p>
        ) : roadmaps.length > 0 ? (
          roadmaps.map((category) => (
            <Link
              key={category._id}
              to={`/roadmap/${category._id}`}
              className="cursor-pointer px-8 py-4 rounded-xl flex items-center justify-center text-2xl border-3 border-violet-300 hover:bg-violet-300 hover:text-white 
                transform transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl
                min-w-[200px] text-center">
              {category.title || category.slug || "Untitled Roadmap"}
            </Link>
          ))
        ) : (
          <p className="text-2xl text-gray-600">No roadmaps found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}
