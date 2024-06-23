import { CiHome } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getMyProfile, getUser, getotherUsers } from "../redux/userSlice";

function LeftSideBar() {

    const { user } = useSelector(store => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logOut = async ()=>{
        try {
            const res = await axios.get(`${USER_API_END_POINT}/log-out`,{
                withCredentials:true
            })
            if (res.data.success) {
               dispatch(getUser(null));
               dispatch(getotherUsers(null));
               dispatch(getMyProfile(null)); 
               toast.success(res.data.message);
               navigate("/login")
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-[15%]'>
            <div className="m-2 px-2 py-2">
                <img width={"30px"} src="logo.svg" alt="logo" />
            </div>
            <div className="flex flex-col gap-y-3 my-4">
                <Link to="/" className="home flex items-center text-lg font-semibold hover:bg-gray-200 px-2 py-2 rounded-full cursor-pointer w-fit">
                    <CiHome size={"25px"}/> <h1 className='font-bold text-lg ml-1'>Home</h1>
                </Link>
                <div className="explore flex items-center font-semibold hover:bg-gray-200 px-2 py-2 rounded-full cursor-pointer w-fit">
                    <CiSearch size={"25px"}/> <h1 className='font-bold text-lg ml-1'>Explore</h1>
                </div>
                <div className="notification flex items-center font-semibold hover:bg-gray-200 px-2 py-2 rounded-full cursor-pointer w-fit">
                    <CiBellOn size={"25px"}/> <h1 className='font-bold text-lg ml-1'>Notification</h1>
                </div>
                <Link to={`/profile/${user?._id}`} className="profile flex items-center font-semibold hover:bg-gray-200 px-2 py-2 rounded-full cursor-pointer w-fit">
                    <RxAvatar size={"25px"}/> <h1 className='font-bold text-lg ml-1'>Profile</h1>
                </Link>
                <Link to={'/bookmark'} className="bookmark flex items-center font-semibold hover:bg-gray-200 px-2 py-2 rounded-full cursor-pointer w-fit">
                    <CiBookmark size={"25px"}/> <h1 className='font-bold text-lg ml-1'>Bookmark</h1>
                </Link>
                <div  onClick={logOut} className="logout flex items-center font-semibold hover:bg-gray-200 px-2 py-2 rounded-full cursor-pointer w-fit">
                    <CiLogout size={"25px"}/> <h1 className='font-bold text-lg ml-1'>Logout</h1>
                </div>
                <button className="py-2 border-none text-md bg-[#1D98f0] text-white rounded-full w-[90%]">Post</button>
            </div>
        </div>
    )
}

export default LeftSideBar