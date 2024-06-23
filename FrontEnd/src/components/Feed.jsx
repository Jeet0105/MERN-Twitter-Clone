import { useSelector } from "react-redux"
import CreatePost from "./CreatePost"
import Tweet from "./Tweet"

function Feed() {

  const { tweets } = useSelector(store => store.tweet);

  return (
    <div className="w-[60%] border-l border-r border-gray-400">
      <CreatePost />
      {
        tweets?.map((tweet) => <Tweet key={tweet?._id} tweet={tweet}/>)
      }
    </div>
  )
}

export default Feed