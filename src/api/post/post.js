import axios from "axios";
import { BASE_URL } from "../../constants/constant";

// const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');

export const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get_posts`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      throw Error (error)
    }
};


export const fetchPostsById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/get_posts/${userId}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};


export const upVote = async (postId, refetch) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/${postId}/upvote`,
        {}, // Request body can be empty for liking
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      console.log(response)
      refetch()
      return response.data;
    } catch (error) {
      console.log(error)
      }
  };

export const downVote = async (postId, refetch) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/${postId}/downvote`,
        {}, // Request body can be empty for unliking
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

export const tweetPost = async (postId, refetch) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/tweet/${postId}`,
        {}, // Request body can be empty for liking
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      console.log(response.data)
      refetch()
      return response.data;
    } catch (error) {
      console.log(error)
      }
  };
export const untweetPost = async (postId, refetch) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/undo/${postId}`,
        {}, // Request body can be empty for liking
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

  export const follow = async (followerId, refetch) => {
    try {
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
