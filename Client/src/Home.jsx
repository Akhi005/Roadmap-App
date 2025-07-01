import { Outlet } from "react-router-dom"

export default function Home() {
  return (
    <div className="w-full bg-gray-100 min-h-screen"> 
      <header className="py-10"> 
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-center text-gray-800 tracking-tight"> 
          TalkTrack
        </h1>
        <p className="px-6 md:px-20 lg:px-72 text-center text-lg md:text-xl my-6 text-gray-600 leading-relaxed"> 
          A collaborative roadmap platform that empowers users to engage directly
          with product development ideas through upvotes, comments, and
          discussions. Designed for transparency and community-driven feedback.
        </p>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center"> 
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center w-full max-w-8xl mx-auto">
          <div className="w-full lg:w-1/2"> 
            <img
              src="https://i.ibb.co/4wZWqKwN/road-map-removebg-preview.png"
              className="w-full h-full" 
              alt="Roadmap" 
            />
          </div>
          <div className="w-[500px] flex items-center justify-center lg:ml-12"> 
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}