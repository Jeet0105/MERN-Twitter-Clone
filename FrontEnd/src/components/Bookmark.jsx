import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import { useSelector } from "react-redux";
import Tweet from "./Tweet";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";

function Bookmark() {
    const { user, otherUsers } = useSelector(store => store.user);
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        const getBookmarkTweets = async () => {
            if (!user?._id) return;

            try {
                const res = await axios.post(`${USER_API_END_POINT}/getBookmarkTweets`, 
                    { id: user._id },
                    { withCredentials: true }
                );

                if (res.data.success) {
                    setTweets(res.data.tweets);
                } else {
                    console.error("Failed to fetch bookmarked tweets:", res.data.message);
                }
            } catch (error) {
                console.error("Error fetching bookmarked tweets:", error);
            }
        };

        getBookmarkTweets();
    }, [user]);

    return (
        <div className="flex w-[80%] mx-auto">
            <LeftSideBar />
            <div className="w-[80%] border-l border-r border-gray-400">
                <h1 className="w-fit mx-auto text-xl font-bold py-4">Bookmark Tweets</h1>
                <div className="w-full h-0.5 bg-gray-400"></div>
                {!tweets.length ? (
                    <h3>No bookmarked tweet Found</h3>
                ) : (
                    tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet}/>)
                )}
            </div>
            <RightSideBar otherUsers={otherUsers} />
        </div>
    );
}

export default Bookmark;