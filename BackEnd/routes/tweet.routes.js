import e from "express";
import {
    createTweet,
    deleteTweet,
    getAllTweets,
    getFollowingUserTweets,
    likeOrDislike
} from "../controllers/tweet.controller.js";
import isAuthenticated from "../config/auth.js";

const router = e.Router();

router.route("/create").post(isAuthenticated, createTweet);
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);
router.route("/like/:id").put(isAuthenticated, likeOrDislike);
router.route("/getalltweet/:id").get(isAuthenticated, getAllTweets);
router.route("/getfollowingtweet/:id").get(isAuthenticated, getFollowingUserTweets);

export default router;