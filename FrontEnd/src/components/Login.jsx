import { useState } from "react";
import axios from "axios"
import { USER_API_END_POINT } from "../utils/constants"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { getUser } from "../redux/userSlice";

function Login() {

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandeler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      //login
      try {
        const res = await axios.post(`${USER_API_END_POINT}/log-in`, { email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        });

        dispatch(getUser(res?.data?.user));

        if (res.data.success) {
          navigate("/")
          toast.success(res.data.message)
        }
      } catch (error) {
        toast.success(error.response.data.message)
        console.log(error);
      }
    } else {
      //signup
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, { name, username, email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        });
        if (res.data.success) {
          setIsLogin(true)
          toast.success(res.data.message)
        }
      } catch (error) {
        toast.success(error.response.data.message)
        console.log(error);
      }
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex items-center w-[80vw] justify-between">
        <div>
          <img src="logo.svg" />
        </div>
        <div className="ml-6">
          <div>
            <h1 className="text-5xl font-bold">Happening Now</h1>
          </div>
          <h3 className="text-3xl font-bold my-5">{isLogin ? "LogIn" : "Signup"}</h3>
          <form onSubmit={submitHandeler} className="flex flex-col gap-y-3 items-start">
            {
              !isLogin && (
                <>
                  <div className="flex flex-col items-start justify-between gap-x-2">
                    Name:<input type="text" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-1 outline-blue-500 border border-gray-800 rounded-full font-semibold" placeholder="Name" />
                  </div>
                  <div className="flex flex-col items-start justify-center gap-x-2">
                    Username:<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="px-3 py-1 outline-blue-500 border border-gray-800 rounded-full font-semibold" placeholder="Username" />
                  </div>
                </>
              )
            }
            <div className="flex flex-col items-start justify-center gap-x-2">
              Email:<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-1 outline-blue-500 border border-gray-800 rounded-full font-semibold" placeholder="Email" />
            </div>
            <div className="flex flex-col items-start justify-center gap-x-2">
              Password:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-3 py-1 outline-blue-500 border border-gray-800 rounded-full font-semibold" placeholder="Password" />
            </div>
            <button className="bg-[#1D98F0] border-none py-2 rounded-full w-[60%] text-white text-lg font-semibold">{isLogin ? "Login" : "Create account"}</button>
            <h5>
              {isLogin ? "Not have an account" : "Already have an account?"}<span className="font-semibold cursor-pointer text-blue-500 ml-1" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Signup" : "Login"}</span>
            </h5>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;