import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js"

const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body
        // const id = req.user
        if (!description || !id) {
            return res.status(401).json({
                message: "Fields are required",
                success: "false"
            })
        }

        const user = await User.findById(id).select("-password");

        await Tweet.create({
            description,
            userId: id,
            userDetails: user
        })

        return res.status(201).json({
            message: "Tweet created sucessfully",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(401).json({
                message: "Fields are requeired",
                success: false
            })
        }
        const deleatedTweet = await Tweet.findByIdAndDelete(id);
        return res.status(201).json({
            message: "Tweet deleated sucessfully",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;

        // Find the tweet by ID
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found" });
        }

        // Check if user has already liked the tweet
        if (tweet.like.includes(loggedInUserId)) {
            // Dislike
            await Tweet.findByIdAndUpdate(
                tweetId,
                { $pull: { like: loggedInUserId } },
                { new: true }
            );
            return res.status(200).json({
                message: "User disliked tweet",
                success: true
            });
        } else {
            // Like
            await Tweet.findByIdAndUpdate(
                tweetId,
                { $push: { like: loggedInUserId } },
                { new: true }
            );
            return res.status(200).json({
                message: "User liked tweet",
                success: true
            });
        }
    } catch (error) {
        console.error("Error during like/dislike operation:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const getAllTweets = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const loggedInUserTweets = await Tweet.find({ userId: id });

        const followingUserTweets = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return Tweet.find({ userId: otherUserId })
        }));

        return res.status(200).json({
            tweets: loggedInUserTweets.concat(...followingUserTweets)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const getFollowingUserTweets = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const followingUserTweets = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return Tweet.find({ userId: otherUserId })
        }));

        return res.status(200).json({
            tweets: [].concat(...followingUserTweets)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export {
    createTweet,
    deleteTweet,
    likeOrDislike,
    getAllTweets,
    getFollowingUserTweets
}