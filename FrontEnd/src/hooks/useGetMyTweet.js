import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";

const useGetMyTweet = (id) => {

    const { isActive } = useSelector(store => store.tweet);

    const dispatch = useDispatch();
    const { refresh } = useSelector(store => store.tweet);

    const followingTweetHandler = async () => {
        try {
            const res = await axios.get(`${TWEET_API_END_POINT}/getfollowingtweet/${id}`, { withCredentials: true });
            dispatch(getAllTweets(res.data.tweets));
        } catch (error) {
            console.log(error);
        }
    }

    const fetchMyTweet = async () => {
        try {
            const res = await axios.get(`${TWEET_API_END_POINT}/getalltweet/${id}`, {
                withCredentials: true
            });
            dispatch(getAllTweets(res.data.tweets))
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isActive) {
            fetchMyTweet();
        }
        else {
            followingTweetHandler()
        }
    }, [isActive,refresh])
};

export default useGetMyTweet;