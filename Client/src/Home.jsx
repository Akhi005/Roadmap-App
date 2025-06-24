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
      <div className="flex  w-full px-14">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center w-full ">
          <div className="w-full flex justify-center items-center">
            <img
              src="https://i.ibb.co/4wZWqKwN/road-map-removebg-preview.png"
              className="w-full h-auto object-cover lg:max-h-screen rounded-xl"
              alt="roadmap"
            />
          </div>
          <div className="w-[800px] mr-12 flex items-center justify-center">
            <Outlet />
          </div>
      </div>
      </div>
    </div>
  )
}
