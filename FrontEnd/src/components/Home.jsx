import { useSelector } from "react-redux";
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"
import { Outlet, useNavigate } from "react-router-dom"
import useOtherUsers from "../hooks/useOtherUsers";
import useGetMyTweet from "../hooks/useGetMyTweet";
import { useEffect } from "react";

function Home() {
    const { user, otherUsers } = useSelector(store => store.user);

    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [])

    //custom hook
    useOtherUsers(user?._id);
    useGetMyTweet(user?._id);
    
    return (
        <div className="flex w-[80%] mx-auto">
            <LeftSideBar />
            <Outlet />
            <RightSideBar otherUsers={otherUsers}/>
        </div>
    )
}

export default Home