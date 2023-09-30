import axios from "axios";
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react";
import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Reply from "./Reply";
import { getUserProfile } from "../../api/api";
import { BASE_URL } from "../../constants/constant";
import { Divider } from "@mui/material";
import TextareaAutosize from "react-textarea-autosize";

function Comment({comment, getComment, postId}) {
    const userId = localStorage.getItem('userId');
    const [profile, setProfile] = useState(''); // Initialize with an empty string
    const [open, setOpen] = useState(false); // Initialize with an empty string
    const [reply, setReply] = useState(""); // Initialize with an empty string
    const [replies, setReplies] = useState(null); // Initialize with an empty string
      // Fetch and set the username when the component mounts
  useEffect(() => {
    getUserProfile(comment.userId)
      .then((result) => {
        setProfile(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [comment.userId]);

  const likePost = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/${commentId}/upvote_comment`,
        {}, // Request body can be empty for liking
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      getComment(postId)
      return response.data;
    } catch (error) {
      console.log(error)
    }
  };
  const unlikePost = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/${commentId}/downvote_comment`,
        {}, // Request body can be empty for unliking
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      getComment(postId)
      return response.data;
    } catch (error) {
      console.log(error)
    }
  };
  const handleLike = async (commentId) => {
    try {
      await likePost(commentId);
      // Update the liked status for the post
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnlike = async (commentId) => {
    try {
      await unlikePost(commentId);
      // Update the liked status for the post
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickOpen = (commentId) =>{
    setOpen(true)
    getReplies(commentId)
  }
  const handleReply = async(commentId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${BASE_URL}/${commentId}/reply_comment`,
          {reply}, // Request body can be empty for liking
          {
            headers: {
              "Authorization" : token,
            },
          }
        );
        getReplies(commentId)
        setReply("")
        return response.data;
      } catch (error) {
        console.log(error)
      }
  }
  const getReplies = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/${commentId}/get_replies`,
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      setReplies(response.data.comments)
      return response.data;
    } catch (error) {
      console.log(error)
      }
  };
  return (
    <div className="">
        {/* Comment Header */}
        <div className="p-1 md:p-2 w-[100%] flex gap-2 md:gap-3 ">
            <Link to={`/profile/${comment.userId}`}> 
              <div className='w-10 h-10 rounded-full dark:text-[#f2e4fb] text-[#060109]'>
                {profile?.profileImage ? 
                    <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profile?.profileImage}`} alt="" />
                    :
                    <img className="rounded-full w-full h-full object-cover" src={profile?.avatarData} alt />
                }
              </div>
            </Link>
            <div className="w-full">
                <div className="flex flex-col gap-2 ">
                    <div className="flex flex-col">
                      <div className='flex gap-1 items-center'>
                        <span className="text-sm font-bold">{profile?.fullname}</span>
                        <Link to={`/profile/${comment.userId}`} className="text-xs hover:underline dark:text-gray-300 text-gray-600 font-bold">@{profile?.username}</Link>
                      </div>
                      <span className="hover:underline text-xs text-gray-500">{formatDistanceToNow(Date.parse(comment.createdAt))}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        {comment.text}
                    </div>
                    {/* Post Actions */}
                    <div className="flex items-center gap-6 text-[#060109]">
                        {/* Render like/unlike button based on liked status */}
                        <div className="flex items-center border-[1px] bg-gray-50 rounded-full">
                        <button
                            onClick={() => handleLike(comment?._id)}
                            className="p-1 px-2 border-r-[1px] rounded-t-r-full flex items-center gap-2"
                        >
                            {
                            comment?.upvotes.includes(userId) ?
                            <BsFillArrowUpSquareFill size={15} color="#4f1179" /> : 
                            <BsFillArrowUpSquareFill size={15} color="gray" />
                            }
                            <span className='text-sm'>{comment.upvotes.length}</span>
                        </button>
                        <button
                            onClick={() => handleUnlike(comment?._id)}
                            className="p-1 px-2 rounded flex items-center gap-2 "
                        >
                          {
                            comment?.downvotes.includes(userId) ?
                            <BsFillArrowDownSquareFill size={15} color="#4f1179" /> :
                            <BsFillArrowDownSquareFill size={15} color="gray" /> 
                          }
                            <span className='text-sm'>{comment.downvotes.length}</span>
                        </button>
                        </div>
                        <button className='flex items-center gap-2'>
                            <span onClick={()=>handleClickOpen(comment._id)} className="cursor-pointer text-sm text-gray-500 hover:underline">Reply</span>
                        </button>

                    </div>
                    {
                        !open? null : 
                        <div className="w-full flex gap-1 min-h-8 items-center">
                          <TextareaAutosize
                            type="text"
                            value={reply} onChange={(e)=>setReply(e.target.value)}
                            className="h-4 flex-grow p-2 rounded-md bg-white text-[#060109] border-[1px]  text-sm focus:text-sm outline-none"
                            placeholder="Add a reply"
                            cacheMeasurements={true}
                            autoFocus
                            style={{ resize: 'none' }} // Add this line to hide the resize handle
                          />
                            {/* <input type="text" value={reply} onChange={(e)=>setReply(e.target.value)} className="w-full text-sm rounded-full border-[1px] px-3 border-gray-300 p-1 " placeholder="Add a reply" /> */}
                            <button onClick={()=>handleReply(comment._id)} className="bg-[#4f1179] py-1 px-3 text-sm rounded-full text-white">Reply</button>
                        </div>
                    }

                    {/*Reply  */}
                    <div className="">
                        {replies?.map((reply,idx)=>(
                           <Reply key={idx} reply={reply} getReplies={getReplies} commentId={comment._id} />
                        ))}
                    </div>
              </div>
        </div>
        </div>
        <Divider />
    </div>
  )
}

export default Comment