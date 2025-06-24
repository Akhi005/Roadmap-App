import { Outlet } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-200">
      <h2 className="text-7xl font-bold text-center pt-5">TalkTrack</h2>
      <p className="px-72 text-center text-xl my-8">
        A collaborative roadmap platform that empowers users to engage directly
        with product development ideas through upvotes, comments, and
        discussions. Designed for transparency and community-driven feedback.
      </p>
      <div className="flex gap-24 w-full px-44">
        <img
          src="https://i.ibb.co/4wZWqKwN/road-map-removebg-preview.png"
          className="w-full h-full flex-1"
          alt="roadmap" />
        <div >
          <Outlet />
        </div>
      </div>
    </div>
  )
}
