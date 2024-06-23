import { useState } from 'react';
import Avatar from 'react-avatar';
import { CiImageOn } from "react-icons/ci";
import axios from "axios"
import { TWEET_API_END_POINT } from '../utils/constants'
import toast from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux';
import { getIsActive, getRefresh } from '../redux/tweetSlice';

function CreatePost() {

    const [description, setDescription] = useState("");
    const { user } = useSelector(store => store.user);
    const { isActive } = useSelector(store => store.tweet);
    const dispatch = useDispatch();

    const submitHandeler = async () => {
        try {
            const res = await axios.post(`${TWEET_API_END_POINT}/create`, { description, id: user?._id }, { withCredentials: true });
            dispatch(getRefresh());
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.success(error.response.data.message);
            console.log(error);
        }
        setDescription("")
    }

    const forYouHandler = async () => {
        dispatch(getIsActive(true));
    }

    const fowlloingHandler = async () => {
        dispatch(getIsActive(false))
    }

    return (
        <div>
            <div className="flex items-center justify-around border-b border-gray-400">
                <div onClick={forYouHandler} className={`w-1/2 text-center py-4 hover:bg-gray-200 cursor-pointer ${isActive ? "border-b-4 border-blue-600" : ""}`}>
                    <h1 className="font-bold text-lg">For You</h1>
                </div>
                <div onClick={fowlloingHandler} className={`w-1/2 text-center py-4 hover:bg-gray-200 cursor-pointer ${isActive ? "" : "border-b-4 border-blue-600"}`}>
                    <h1 className="font-bold text-lg">Following</h1>
                </div>
            </div>

            <div className='flex items-center gap-x-1 justify-center mt-2'>
                <div className='ml-4'>
                    <Avatar src="https://pbs.twimg.com/profile_images/1559124414251565056/ud3MXsiZ_400x400.jpg" size="40" round={true} />
                </div>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='What is happening?!' className='outline-none text-lg mx-3 w-full' />
            </div>

            <div className='w-[88%] h-[1px] bg-gray-400 ml-14 my-5'></div>

            <div className='flex justify-between pl-14 pr-5 pb-4 border-b border-gray-400'>
                <CiImageOn size={"30px"} className='cursor-pointer' />
                <button onClick={submitHandeler} className='bg-[#1D98f0] px-6 py-2 rounded-full text-white font-bold'>Post</button>
            </div>
        </div>
    )
}

export default CreatePost