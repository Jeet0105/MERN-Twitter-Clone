import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getotherUsers } from "../redux/userSlice";

const useOtherUsers = (id) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchOtherUsers = async () => {
      if (!id) {
        console.error("User ID is not defined");
        return;
      }
      
      try {
        const res = await axios.get(`${USER_API_END_POINT}/other-user/${id}`, {
          withCredentials: true,
        });
        dispatch(getotherUsers(res.data.otherUsers));
      } catch (error) {
        console.log(error);
      }
    };

    fetchOtherUsers();
  }, [id, dispatch]);
};

export default useOtherUsers;
