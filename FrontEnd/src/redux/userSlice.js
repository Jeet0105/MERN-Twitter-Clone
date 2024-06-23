import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        otherUsers: null,
        profile: null
    },
    reducers: {
        //multiple actions
        getUser: (state, action) => {
            state.user = action.payload;
        },
        getotherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        getMyProfile: (state, action) => {
            state.profile = action.payload;
        },
        followingUpdate: (state, action) => {
            const userId = action.payload;
            const isFollowing = state.user.following.includes(userId);

            if (isFollowing) {
                state.user.following = state.user.following.filter(itemId => itemId !== userId);
            } else {
                state.user.following = [...state.user.following, userId];
            }
        }
    }
});

export const { getUser, getotherUsers, getMyProfile, followingUpdate } = userSlice.actions;
export default userSlice.reducer;