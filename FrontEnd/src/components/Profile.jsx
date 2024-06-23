import Avatar from "react-avatar";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGetProfile from "../hooks/useGetProfile.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants.js";
import toast from "react-hot-toast";
import { followingUpdate } from "../redux/userSlice.js";
import { getRefresh } from "../redux/tweetSlice";

function Profile() {

  const { profile, user } = useSelector(store => store.user);
  const { id } = useParams();
  useGetProfile(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const followAndUnfollowHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, { id: user?._id }, {
        withCredentials: true
      });

      dispatch(followingUpdate(id));
      dispatch(getRefresh());

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const editProfileHandler = () => {
    navigate("/edit-profile");
  }

  if (!profile) {
    return (
      <div className="w-[60%] border-l border-r border-gray-400">
        <div className="w-full mt-3">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[60%] border-l border-r border-gray-400">
      <div className="w-full mt-3">

        <div className="flex items-center gap-x-2 mb-3">
          <Link to="/" className="hover:bg-gray-200 p-1 rounded-full">
            <IoIosArrowRoundBack size={40} />
          </Link>
          <div>
            <h1 className="font-bold text-xl">{profile.name}</h1>
            <p className="text-sm text-gray-400">
              <div className="flex gap-x-4">
                <div>
                  Followers:<span>{user.followers.length}</span>
                </div>
                <div>
                  Following:<span>{user.following.length}</span>
                </div>
              </div>
            </p>
          </div>
        </div>

        <img src="http://www.thewowstyle.com/wp-content/uploads/2015/01/facebook-cover-9.jpg" className="h-[40vh] w-[100vw]" />

        <div>
          <Avatar src="https://pbs.twimg.com/profile_images/1559124414251565056/ud3MXsiZ_400x400.jpg" size="130" round={true} className="absolute top-[20vh] ml-2" />
        </div>

        <div className="text-right m-4">
          {
            profile?._id === user?._id ? (
              <button onClick={editProfileHandler} className="px-4 py-1 rounded-full border border-gray-400 hover:bg-gray-200">
                Edit Profile
              </button>
            ) : (
              <button onClick={followAndUnfollowHandler} className="px-4 py-1 rounded-full bg-black border border-gray-400 text-white">
                {user.following.includes(profile._id) ? "Following" : "Follow"}
              </button>
            )
          }


        </div>

        <div className="m-4 ml-6">
          <h1 className="font-bold text-xl">{profile?.name}</h1>
          <p className="text-gray-400">{`@${profile?.username}`}</p>
        </div>

        <div className="ml-6">
          <p>{user.bio ? user.bio : "Bio not added"}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile