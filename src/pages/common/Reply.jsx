import axios from "axios";
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react";
import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill } from "react-icons/bs"
import { Link } from "react-router-dom"
import { getUserProfile } from "../../api/api";
import { BASE_URL } from "../../constants/constant";

function Reply({ reply, commentId, getReplies }) {
  const userId = localStorage.getItem('userId');
  const [profile, setProfile] = useState(''); // Initialize with an empty string
  // Fetch and set the username when the component mounts
  useEffect(() => {
    getUserProfile(reply.userId)
      .then((result) => {
        setProfile(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reply.userId]);

  const likePost = async (replyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/${replyId}/upvote_reply`,
        {}, // Request body can be empty for liking
        {
          headers: {
            "Authorization": token,
          },
        }
      );
      getReplies(commentId)
      return response.data;
    } catch (error) {
      console.log(error)
    }
  };

  const unlikePost = async (replyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/${replyId}/downvote_reply`,
        {}, // Request body can be empty for unliking
        {
          headers: {
            "Authorization": token,
          },
        }
      );      
      getReplies(commentId)
      return response.data;
    } catch (error) {
      console.log(error)
    }
  };

  const handleLike = async (replyId) => {
    try {
      await likePost(replyId);
      // Update the liked status for the post
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlike = async (replyId) => {
    try {
      await unlikePost(replyId);
      // Update the liked status for the post
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-black flex border-gray-200 pb-3 border-b-[1px]  gap-3 my-1 ">
      <Link to={`/profile/${reply.userId}`}>
        <div className='w-8 h-8 rounded-full bg-black'>
          <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profile?.profileImage}`} alt="" />
        </div>
      </Link>
      <div className="flex flex-col gap-1 ">
        <div className="flex gap-1 items-center">
          <span className="text-sm font-bold">{profile?.username}</span>
          <span className="text-red text-xs text-blue-500">Follow</span>
          <span className="hover:underline text-sm">{formatDistanceToNow(Date.parse(reply.createdAt))}</span>
        </div>
        <div className="">
          {reply.text}
        </div>
        {/* Post Actions */}
        <div className="flex items-center gap-6">
          {/* Render like/unlike button based on liked status */}
          <div className="flex items-center bg-gray-100 border-2 border-gray-200 rounded-full">
            <button
              onClick={() => handleLike(reply?._id)}
              className="p-1 px-2 border-r-2 border-gray-200 rounded-t-r-full flex items-center gap-2"
            >
              {
                reply?.upvotes.includes(userId) ?
                  <BsFillArrowUpSquareFill size={15} color="green" /> :
                  <BsFillArrowUpSquareFill size={15} color="blue" />
              }
              <span className='text-sm'>{reply.upvotes.length}</span>
            </button>
            <button
              onClick={() => handleUnlike(reply?._id)}
              className="p-1 px-2 rounded flex items-center gap-2 "
            >
              <BsFillArrowDownSquareFill size={15} color="black" />
              <span className='text-sm'>{reply.downvotes.length}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reply;
