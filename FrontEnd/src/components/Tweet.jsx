import Avatar from "react-avatar"
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios"
import { TWEET_API_END_POINT, USER_API_END_POINT } from '../utils/constants'
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/tweetSlice";
import { timeSince } from "../utils/constants";

function Tweet({ tweet }) {

    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const likeDislikeHandler = async (tweetId) => {
        try {
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${tweetId}`, { id: user?._id }, { withCredentials: true });
            dispatch(getRefresh());
            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
            console.log(error);
        }
    }

    const deleteHandeler = async (tweetId) => {
        try {
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${tweetId}`, { withCredentials: true });
            dispatch(getRefresh());
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
            console.log(error);
        }
    }

    const bookmarkHandler = async (tweetId) => {
        try {
            const res = await axios.put(`${USER_API_END_POINT}/bookmark/${tweetId}`, { id: user?._id }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message || "Tweet bookmarked successfully");
            } else {
                toast.error(res.data.message || "Failed to bookmark tweet");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
            console.log(error);
        }
    }

    return (
        <div className="border-b border-gray-400">
            <div className="p-2">
                <div className="flex items-center mx-3 gap-x-3">
                    <Avatar src="https://pbs.twimg.com/profile_images/1559124414251565056/ud3MXsiZ_400x400.jpg" size="40" round={true} />
                    <div className="flex items-center gap-x-1">
                        <h4 className="text-lg font-semibold">{tweet?.userDetails[0]?.name}</h4>
                        <p className="text-sm text-gray-400 cursor-pointer">@{tweet?.userDetails[0]?.username} · {`${timeSince(tweet?.createdAt)}`}</p>
                    </div>
                </div>

                <div className="ml-16">
                    <p>{tweet?.description}</p>
                </div>

                <div className="flex items-center justify-between ml-16 mr-3 mt-2 mb-1">
                    <div className="hover:text-blue-400 flex items-center justify-center cursor-pointer">
                        <div className="p-2 hover:bg-blue-200 rounded-full">
                            <FaRegComment />
                        </div>
                        <p>0</p>
                    </div>
                    <div onClick={() => likeDislikeHandler(tweet?._id)} className="hover:text-red-400 flex items-center justify-center cursor-pointer">
                        <div className="p-2 hover:bg-red-200 rounded-full">
                            <FaRegHeart />
                        </div>
                        <p>{tweet?.like?.length}</p>
                    </div>
                    <div onClick={()=>bookmarkHandler(tweet?._id)} className="hover:text-yellow-400 flex items-center justify-center cursor-pointer">
                        <div className="p-2 hover:bg-yellow-200 rounded-full">
                            <FaRegBookmark />
                        </div>
                    </div>

                    {
                        user?._id === tweet?.userId && (
                            <div onClick={() => deleteHandeler(tweet?._id)} className="delete hover:bg-gray-200 flex items-center justify-center cursor-pointer rounded-full">
                                <div className="p-2">
                                    <MdDeleteOutline />
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Tweet