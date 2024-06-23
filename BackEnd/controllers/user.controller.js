import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { Tweet } from "../models/tweet.model.js";

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            })
        }

        const existedUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existedUser) {
            return res.status(401).json({
                message: "User already exists",
                success: false
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 16)

        await User.create({
            name,
            username,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "User Created",
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User do not exist",
                success: false
            });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        const tokenData = {
            userId: user._id,
            name: user.name
        };

        const token = jwt.sign(
            tokenData,
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        return res.status(201)
            .cookie("token", token, cookieOptions)
            .json({
                message: `Welcome back ${user.name}`,
                user,
                success: true
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const logout = (req, res) => {
    return res.status(201).cookie("token", "", { expires: new Date(Date.now()) }).json({
        message: "User loged out",
        success: true
    })
};

const bookMark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId)

        if (user.bookmark.includes(tweetId)) {
            //remove
            await User.findByIdAndUpdate(
                loggedInUserId,
                {
                    $pull: { bookmark: tweetId }
                },
                { new: true }
            );
            return res.status(200).json({
                message: "Tweet removed from bookmarks",
                success: true,
            });
        } else {
            // add
            await User.findByIdAndUpdate(
                loggedInUserId,
                {
                    $push: { bookmark: tweetId }
                },
                { new: true }
            );
            return res.status(200).json({
                message: "Tweet added to bookmarks",
                success: true,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(401).json({
                message: "Id is reuired",
                success: false
            });
        }
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const getOtherUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");

        if (!otherUsers) {
            return res.status(401).json({
                message: "No user found"
            })
        }

        return res.status(200).json({
            otherUsers
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const follow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        // Find both users
        const [loggedInUser, user] = await Promise.all([
            User.findById(loggedInUserId),
            User.findById(userId)
        ]);

        // Check if both users exist
        if (!loggedInUser || !user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Determine if the logged-in user is already following the target user
        const isFollowing = user.followers.includes(loggedInUserId);

        // Update followers and following lists accordingly
        if (isFollowing) {
            await Promise.all([
                user.updateOne({ $pull: { followers: loggedInUserId } }),
                loggedInUser.updateOne({ $pull: { following: userId } })
            ]);
            return res.status(200).json({
                message: `User just unfollowed ${user.name}`,
                success: true
            });
        } else {
            await Promise.all([
                user.updateOne({ $push: { followers: loggedInUserId } }),
                loggedInUser.updateOne({ $push: { following: userId } })
            ]);
            return res.status(200).json({
                message: `User just followed ${user.name}`,
                success: true
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const getBookmarkTweets = async (req, res) => {
    try {
        const id = req.body.id;
        const loggedInUser = await User.findById(id);

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const bookmarkedTweetIds = loggedInUser.bookmark;

        const tweets = await Tweet.find({ _id: { $in: bookmarkedTweetIds } });

        return res.status(200).json({
            success: true,
            tweets
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching bookmarked tweets",
            success: false,
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {

        const { username, email, oldEmail, oldUsername, bio } = req.body;

        // Check if at least one field is provided for update
        if (!username && !email && !bio) {
            return res.status(400).json({
                message: "At least one field is required to update",
                success: false
            });
        }

        // Build the filter object
        const filter = {};
        if (oldEmail) filter.email = oldEmail;
        if (oldUsername) filter.username = oldUsername;

        // Ensure at least one old field is provided for filter
        if (!oldEmail && !oldUsername) {
            return res.status(400).json({
                message: "Either old email or old username is required to find the user",
                success: false
            });
        }

        // Build the update object
        const update = {};
        if (email) update.email = email;
        if (username) update.username = username;
        if (bio) update.bio = bio;

        // Perform the update operation
        const updatedUser = await User.findOneAndUpdate(
            filter,
            { $set: update },
            { new: true }
        );

        // Check if user was found and updated
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Return success response with updated user details
        res.status(200).json({
            message: "User updated successfully.",
            success: true,
            updatedUser: updatedUser
        });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export {
    registerUser,
    login,
    logout,
    bookMark,
    getMyProfile,
    getOtherUsers,
    follow,
    getBookmarkTweets,
    updateUser
}