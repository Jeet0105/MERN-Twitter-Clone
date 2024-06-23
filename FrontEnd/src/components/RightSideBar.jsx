import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { Link } from "react-router-dom"

function RightSideBar({ otherUsers }) {
  return (
    <div className="w-[30%] ml-6">
      <div className="search mt-2 w-full  bg-gray-200 rounded-full outline-none flex items-center">
        <div className="ml-3">
          <CiSearch size={"25px"} />
        </div>
        <input type="text" className="w-full p-2 bg-transparent outline-none rounded-full" placeholder="Search" />
      </div>

      <div className="mt-4 p-2 border border-gray-400 rounded-xl w-full">
        <h1 className="font-bold text-xl">Who to follow</h1>

        {/* Profile of users */}
        {otherUsers?.map((user) => (
          <div key={user._id} className="profile my-6 w-full">
            <div className="my-2 flex items-center justify-between">
              <div className="name flex items-center gap-x-1">
                <Avatar
                  src={user.avatar || "https://pbs.twimg.com/profile_images/1559124414251565056/ud3MXsiZ_400x400.jpg"}
                  size="40"
                  round={true}
                />
                <div className="flex flex-col items-start">
                  <h4 className="font-bold">{user?.name}</h4>
                  <p className="text-sm text-gray-400">{`@${user?.username}`}</p>
                </div>
              </div>
              <Link to={`/profile/${user?._id}`}>
                <button className="px-4 py-1 bg-black text-white rounded-full" >
                  Profile
                </button>
              </Link>
            </div>
          </div>
        ))}


      </div>
    </div>
  )
}

export default RightSideBar