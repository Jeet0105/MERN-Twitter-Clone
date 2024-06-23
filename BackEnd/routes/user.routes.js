import e from "express";
import {
    bookMark,
    follow,
    getBookmarkTweets,
    getMyProfile,
    getOtherUsers,
    login,
    logout,
    registerUser,
    updateUser
} from "../controllers/user.controller.js";
import isAuthenticated from "../config/auth.js";

const router = e.Router();

router.route("/register").post(registerUser);
router.route("/log-in").post(login);
router.route("/log-out").get(logout);
router.route("/bookmark/:id").put(isAuthenticated, bookMark);
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
router.route("/other-user/:id").get(isAuthenticated, getOtherUsers);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/getBookmarkTweets").post(isAuthenticated, getBookmarkTweets);
router.route("/update").post(isAuthenticated, updateUser);

export default router