import SignInForm from "../forms/SignInForm"

export default function Banner(){
  return(
    <div className="">
      <h2 className="text-7xl font-bold text-center pt-5">TalkTrack</h2>
      <p className="px-72 text-center text-xl my-8">A collaborative roadmap platform that empowers users to engage directly with product development ideas through upvotes, comments and discussions. Designed for transparency and community-driven feedback.</p>
      <div className="flex gap-24 px-44">
        <div className="flex-1 w-1/2">
          <img src="https://i.ibb.co/4wZWqKwN/road-map-removebg-preview.png" className="w-full h-full"/>
        </div>
        <div className="w-1/3">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}