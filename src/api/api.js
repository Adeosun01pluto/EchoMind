import axios from "axios";
import { BASE_URL } from "../constants/constant";

export const getUserId = () => {
  const userId = localStorage.getItem('userId');
  return userId || ''; // Return an empty string if userId is not found
}
const token = localStorage.getItem('token');

export const getUsernameById = async (userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/get_username/${userId}`,
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error)
      }
};

export const getUserProfile = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/profile/${userId}`,
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error)
    }
};

export const follow = async (followerId, refetch) => {
  try {
      const response = await axios.get(`${BASE_URL}/auth/follow/${followerId}`,
      {
          headers: {
            "Authorization" : token,
          },
        }
      );
      refetch()
      return response.data;
    } catch (error) {
     console.log(error)
    }
};

export const unfollow = async (followerId, refetch) => {
  try {
      const response = await axios.get(`${BASE_URL}/auth/un_follow/${followerId}`,
      {
          headers: {
            "Authorization" : token,
          },
        }
      );
      refetch()
      return response.data;
    } catch (error) {
      console.log(error)
    }
};

export const getFollowings = async ( userId) => {
  try {
      const response = await axios.get(`${BASE_URL}/auth/read_followings/${userId}`,
      {
          headers: {
            "Authorization" : token,
          },
        }
      );
      return response.data.followings;
    } catch (error) {
      console.log(error)
    }
};

export const getFollowers = async ( userId) => {
  try {
      const response = await axios.get(`${BASE_URL}/auth/read_followers/${userId}`,
      {
          headers: {
            "Authorization" : token,
          },
        }
      );
      return response.data.followers;
    } catch (error) {
      console.log(error)
    }
};