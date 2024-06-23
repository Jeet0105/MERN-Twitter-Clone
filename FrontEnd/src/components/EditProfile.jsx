import { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function EditProfile() {
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const user = useSelector((store) => store.user);

    const editProfileHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!email && !username) {
            setError("At least one field is required");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                `${USER_API_END_POINT}/update`,
                { email, username,bio, oldEmail: user?.user?.email, oldUsername: user?.user?.username },
                { withCredentials: true }
            );
            if (res.data.success) {
                setSuccess("Profile updated successfully!");
                toast.success(res.data.message || "Profile updated successfully!");
            } else {
                setError(res.data.message || "An error occurred while updating the profile.");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError("Bad request. Please check your input data.");
                } else {
                    setError(error.response.data.message || "An error occurred while updating the profile.");
                }
            } else if (error.request) {
                setError("No response received from the server. Please try again later.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
            setTimeout(() => {
                setError("");
                setSuccess("");
            }, 3000);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="flex items-center w-[80vw] justify-between">
                <div>
                    <img src="logo.svg" alt="Logo" />
                </div>
                <div className="ml-6">
                    <div>
                        <h1 className="text-5xl font-bold">Happening Now</h1>
                    </div>
                    <h3 className="text-3xl font-bold my-5">Edit Profile</h3>
                    <form onSubmit={editProfileHandler} className="flex flex-col gap-y-3 items-start">
                        <div className="flex flex-col items-start justify-center gap-x-2">
                            <label htmlFor="username">Username:</label>
                            <input
                                id="username"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                type="text"
                                className="px-3 py-1 outline-blue-500 border border-gray-800 rounded-full font-semibold"
                                placeholder="Username"
                            />
                        </div>

                        <div className="flex flex-col items-start justify-center gap-x-2">
                            <label htmlFor="username">Bio:</label>
                            <input
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                type="text"
                                className="px-3 py-1 outline-blue-500 border border-gray-800 rounded-full font-semibold"
                                placeholder="Bio"
                            />
                        </div>

                        <div className="flex flex-col items-start justify-center gap-x-2">
                            <label htmlFor="email">Email:</label>
                            <input
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="px-3 py-1 outline-blue-500 border border-gray-800 rounded-full font-semibold"
                                placeholder="Email"
                            />
                        </div>
                        <button type="submit" className="bg-[#1D98F0] border-none py-2 rounded-full w-[60%] text-white text-lg font-semibold" disabled={loading}>
                            {loading ? "Updating..." : "Edit Profile"}
                        </button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {success && <p className="text-green-500 mt-2">{success}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;