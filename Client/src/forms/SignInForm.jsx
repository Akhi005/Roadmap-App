import { useForm } from "react-hook-form"

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log("Submitted:", data)
  }

  const password = watch("password")

  return (
    <div className="border border-3 border-gray-200 rounded-xl bg-gray-300 w-full p-12 mb-12">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div>
          <label className="text-xl">Username</label>
          <input
            className=" bg-gray-200 w-full p-3 my-2 rounded-xl"
            {...register("username", { required: true, minLength: 4 })}
          />
          {errors.username && (
            <span className="text-red-500">
              {errors.username.type === "minLength"
                ? "Username must be at least 4 characters"
                : "Username is required"}
            </span>
          )}
        </div>
        <div>
          <label className="text-xl">Email</label>
          <input
            type="email"
            className=" bg-gray-200 w-full p-3 my-2 rounded-xl"
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
          />
          {errors.email && (
            <span className="text-red-500">
              {errors.email.type === "pattern"
                ? "Please enter a valid email"
                : "Email is required"}
            </span>
          )}
        </div>
        <div>
          <label className="text-xl">Password</label>
          <input
            type="password"
            className=" bg-gray-200 w-full p-3 my-2 rounded-xl"
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password && (
            <span className="text-red-500">
              {errors.password.type === "minLength"
                ? "Password must be at least 6 characters"
                : "Password is required"}
            </span>
          )}
        </div>
        <div>
          <label className="text-xl">Confirm Password</label>
          <input
            type="password"
            className=" bg-gray-200 w-full p-3 my-2 rounded-xl"
            {...register("confirmpassword", {
              required: true,
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmpassword && (
            <span className="text-red-500">
              {errors.confirmpassword.message ||
                "Confirm Password is required"}
            </span>
          )}
        </div>
        <input value="Sign Up"
          className="w-full my-5 font-semibold bg-blue-700 p-2 rounded-2xl text-xl cursor-pointer hover:bg-blue-500 text-white"
          type="submit"
        />
      </form>
        <p className="text-lg">Already have an account ? <span className="font-bold mx-2 text-xl">Login</span></p>
    </div>
  )
}
