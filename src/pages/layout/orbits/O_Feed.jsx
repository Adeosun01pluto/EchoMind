import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom';
import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill, BsSend} from 'react-icons/bs'
import { FaRegComment, FaRetweet} from 'react-icons/fa'
import { useEffect, useState } from 'react';
import {  getUserId, getUserProfile } from '../../../api/api';
import Comment from '../../common/Comment';
import { BASE_URL } from '../../../constants/constant';
import { ThreeDots } from 'react-loader-spinner';

function O_Feed({post, refetch}) {
  const loggedInUserId = getUserId()
    const [profile, setProfile] = useState(''); // Initialize with an empty string
    const [text, setText] = useState(''); // Initialize with an empty string
    const [openComment, setOpenComment] = useState(false);
    const [comentStatus, setCommentStatus] = useState(false);
    const [comments, setComments] = useState([]);
    const [profilePic, setProfilePic] = useState(null); // Initialize with an empty string

  const handleClickOpen = (postId) => {
    getComment(postId)
    setOpenComment(!openComment);
  };
  const userId = localStorage.getItem('userId');
  const likePost = async (postId) => {
      console.log(postId)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4001/orbit/${postId}/upvote`,
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
  const tweetPost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4001/orbit/tweet/${postId}`,
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
  const untweetPost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4001/orbit/undo/${postId}`,
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
  const unlikePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4001/orbit/${postId}/downvote`,
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
  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      // Update the liked status for the post
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnlike = async (postId) => {
    try {
      await unlikePost(postId);
      // Update the liked status for the post

    } catch (error) {
      console.error(error);
    }
  };
  const createComment = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4001/orbit/create_comment/${postId}`,
        {text}, // Request body can be empty for liking
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      setText("")
      getComment(postId)
      refetch()
      return response.data;
    } catch (error) {
      console.log(error)
      }
  };
  const getComment = async (postId) => {
    setCommentStatus(true)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:4001/orbit/get_comments/${postId}`,
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      setComments(response.data.comments)
      setCommentStatus(false)
      return response.data;
    } catch (error) {
      console.log(error)
      }
  };
  const getUserProfileHandler = async(userId) =>{
    try {
      const response = await getUserProfile(userId)
      const res = await getUserProfile(loggedInUserId)
      setProfile(response) 
      setProfilePic(res) 
    } catch (error) {
      console.log(error)
    }
  }

//  fetch and set the username when the component mounts
  useEffect(() => {
    getUserProfileHandler(post.userId)
  }, [post.userId]);
  
  return (
    <div>
      <div  className="dark:bg-[#171517] bg-[white] shadow-md p-1 md:p-2 sm:rounded-sm my-2">
          {/* Post Header */}
          <div className="w-[100%] flex gap-2 py-2 md:gap-3 ">
              <Link to={`/profile/${post.userId}`}> 
              <div className='w-10 h-10 rounded-full bg-black'>
                {profile?.profileImage ? 
                  <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profile?.profileImage}`} alt="" />
                  :
                  <img className="rounded-full w-full h-full object-cover" src={profile?.avatarData} alt />
                }
              </div>
              </Link>
              <div>
                  <div className='flex gap-1 items-center'>
                      <span className="text-sm font-bold">{profile?.fullname}</span>
                      <Link to={`/profile/${post.userId}`} className="text-xs hover:underline dark:text-gray-300 text-gray-600 font-bold">@{profile?.username}</Link>
                  </div>
                  <div className="flex gap-2 items-center">
                      <span className='text-xs text-gray-500'>{formatDistanceToNow(Date.parse(post.createdAt))} ago</span>
                  </div>  
              </div>
          </div>
          {/*  */}

          {/* Post Content */}
          <div className="p-1 md:p-2 dark:text-[#f2e4fb] text-[#060109] text-sm font-semibold md:text-lg py-1 px-2">{post?.content}</div>
          {/*  */}

          {/* Post Actions */}
          <div className="flex items-center gap-6">
            {/* Render like/unlike button based on liked status */}
            <div className="flex items-center  bg-gray-50 text-[#060109] rounded-full">
              <button
                onClick={() => handleLike(post?._id)}
                className="p-1 px-2 border-r-[1px] border-gray-200 rounded-t-r-full flex items-center gap-2"
              >
                {
                  post?.upvotes.includes(userId) ?
                  <BsFillArrowUpSquareFill size={15} color="#4f1179" /> : 
                  <BsFillArrowUpSquareFill size={15} color="gray" />
                }
                <span className='text-xs md:text-sm'>Upvote . {post.upvotes.length}</span>
              </button>
              <button
                onClick={() => handleUnlike(post?._id)}
                className="p-1 px-2 rounded flex items-center gap-2 "
              >
                {post.downvotes.includes(userId)?
                <BsFillArrowDownSquareFill size={15} color="#4f1179" />
                :
                <BsFillArrowDownSquareFill size={15} color="gray" />
                }
                <span className='text-xs md:text-sm'>{post.downvotes.length}</span>
              </button>
            </div>
            {/* Render the tweet and untweet btn */}
            <div className='flex items-center gap-4'>
              <button onClick={()=>handleClickOpen(post._id)} className='flex items-center gap-2'>
                <FaRegComment />
                <span className='text-xs md:text-sm'>{post.comments.length}</span>
              </button>
              {
                post.userId === userId ? 
                  null :
              <button className='flex items-center gap-2'>
                {
                  post?.tweets.includes(userId) ? 
                  <FaRetweet onClick={()=>untweetPost(post._id)} color='#4f1179'/>
                  :
                  <FaRetweet onClick={()=>tweetPost(post._id)}  color='gray'/>
                }
                <span className='text-xs md:text-sm'>{post.tweets.length}</span>
              </button>
              }
            </div>
          </div>
          {/*  */}
          
          {/* Comment Section */}
          {
            openComment? (
              <div className='mt-2 w-full min-h-16'>
                <div className="mx-auto flex p-2 items-center dark:bg-[#060109] dark:mx-1 bg-[#f2e4fb] gap-2">
                  <Link to={`/profile/${post.userId}`}> 
                    <div className='w-10 h-10 rounded-full bg-black'>
                      {profilePic?.profileImage ? 
                      <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profilePic?.profileImage}`} alt="" />
                      :
                      <img className="rounded-full w-full h-full object-cover" src={profilePic?.avatarData} alt />
                      }
                    </div>
                  </Link>
                  <TextareaAutosize 
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-10 rounded-full w-[100%] p-2 text-[#060109] text-sm focus:text-sm outline-none"
                    placeholder="Add comment"
                    cacheMeasurements={true}
                    autoFocus
                    style={{ resize: 'none' }} // Add this line to hide the resize handle
                  />

                  <BsSend
                    className="text-[#4f1179] cursor-pointer"
                    onClick={()=>createComment(post._id)}
                  />
                </div>
                <div className=''>
                  {comentStatus? 
                    <ThreeDots 
                    height="30" 
                    width="30" 
                    radius="9"
                    color="gray" 
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                    />
                  :
                    (comments?.map((comment, idx) => (
                      <Comment key={idx} comment={comment} postId={post._id} getComment={getComment}/>
                    )))
                  }
                </div>
              </div>
            ) : ""
          }
          
          {/*  */}

        </div>
    </div>
  )
}

export default O_Feed