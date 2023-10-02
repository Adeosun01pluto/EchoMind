import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom';
import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill, BsSend} from 'react-icons/bs'
import { FaRegComment, FaRetweet} from 'react-icons/fa'
import { useEffect, useState } from 'react';
import {  getUserId, getUserProfile } from '../../../api/api';
import { BASE_URL } from '../../../constants/constant';
import Comment from '../../common/Comment';
import { downVote, tweetPost, untweetPost, upVote } from '../../../api/post/post';
import { ThreeDots } from 'react-loader-spinner';
import { fetchOrbitName } from '../../../api/orbit/orbit';

function Feed({post, refetch}) {
  const orbitId = post?.orbitId
  const loggedInUserId = getUserId()
  const [loading, setLoading] = useState(false); // Initialize with an empty string
  const [profile, setProfile] = useState(null); // Initialize with an empty string
  const [profilePic, setProfilePic] = useState(null); // Initialize with an empty string
  const [text, setText] = useState(''); // Initialize with an empty string
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);  
  const [orbitData, setOrbitData] = useState(null);  
  const handleClickOpen = (postId) => {
    getComment(postId)
    setOpen(!open);
  };
  const userId = localStorage.getItem('userId');
  
  const handleLike = async (postId) => {
    try {
      await upVote(postId, refetch);
      // Update the liked status for the post
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnlike = async (postId) => {
    try {
      await downVote(postId, refetch);
      // Update the liked status for the post

    } catch (error) {
      console.error(error);
    }
  };
  const createComment = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/create_comment/${postId}`,
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
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/get_comments/${postId}`,
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      setComments(response.data.comments)
      setLoading(false)
      return response.data;
    } catch (error) {
      console.log(error)
      }
  };
  const fetchOrbitNameByID = async(orbitId) =>{
    try {
      if(orbitId){
        const response = await fetchOrbitName(orbitId)
        setOrbitData(response)
      }
    } catch (error) {
      console.log(error)
    }
  }
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
  // const handleFollow = async (followerId) => {
  //   console.log(followerId)
  //   try {
  //     await follow(followerId, getUserProfileHandler, userId);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  
  // const handleUnFollow = async (followerId) => {
  //   console.log(followerId)
  //   try {
  //     await unfollow(followerId, getUserProfileHandler, userId);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // Fetch and set the orbitName when the component mounts
  useEffect(() => {
    fetchOrbitNameByID(orbitId)
  }, [orbitId]);
  // Fetch and set the username when the component mounts
  useEffect(() => {
      getUserProfileHandler(post.userId)
  }, [post.userId]);
  return (
    <div>
      <div  className="dark:bg-[#171517] bg-[white] shadow-md sm:rounded-sm my-2">
          {/* Post Header */}
          
          {
            orbitData?._id? 
             (
                <div className="w-[100%] flex gap-2 py-1 md:gap-3 p-1 md:p-2 ">
                    <Link to={`/orbit/${orbitData._id}`}> 
                    <div className='w-10 h-10 rounded-xl bg-black'>
                      <img className="rounded-xl w-full h-full object-cover" src={orbitData?.coverPhoto ? `${BASE_URL}/images/${orbitData?.coverPhoto} ` :  `/${orbitData?.tempCoverImage}.avif`} alt="" />
                    </div>
                    </Link>
                    <div>
                        <div className="flex gap-2 items-center">
                          <span className="text-sm font-bold  hover:underline">{orbitData?.name} |</span>
                          <span className='text-xs'>Follow</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Link to={`/profile/${post.userId}`} className="text-sm dark:text-gray-300 text-gray-600">Posted by {profile?.fullname}</Link>
                            <span className='text-xs text-gray-500'>{formatDistanceToNow(Date.parse(post.createdAt))} ago</span>
                        </div>
                    </div>
                </div>
             ) 
             : (
                <div className="w-[100%] flex gap-2 py-1 md:gap-3 p-1 md:p-2 ">
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
                        <div className="flex gap-2 items-center">
                          <div className='flex gap-1 items-center'>
                            <span className="text-sm font-bold">{profile?.fullname}</span>
                            <Link to={`/profile/${post.userId}`} className="text-xs hover:underline dark:text-gray-300 text-gray-600 font-bold">@{profile?.username}</Link>
                          </div>
                            {/* {userId === post.userId ? null : 
                            ( !profile?.followings.includes(userId) ? 
                            <span onClick={()=>handleFollow(post.userId)} className="dark:text-[#f2e4fb] text-[#8a1dd3] cursor-pointer text-xs">Follow</span>:
                            <span onClick={()=>handleUnFollow(post.userId)} className="dark:text-[#f2e4fb] text-[#8a1dd3] cursor-pointer text-xs">unfollow</span>
                            )
                            } */}
                        </div>
                        <div className="flex gap-2 items-center">
                            <span className='text-xs text-gray-500'>{formatDistanceToNow(Date.parse(post.createdAt))} ago</span>
                        </div>
                    </div>
                </div>
             )
          }
          
          {/* Post Content */}
          <div className="p-1 md:p-2 dark:text-[#f2e4fb] text-[#060109] text-sm font-semibold md:text-lg py-1 px-2">{post?.content}</div>
          {/*  */}
          {/* Post Actions */}
          <div className="p-1 md:p-2 flex items-center gap-6">
            {/* Render like/unlike button based on liked status */}
            <div className="flex items-center border-[1px] bg-gray-50 text-[#060109] rounded-full">
              <button
                onClick={() => handleLike(post?._id)}
                className="p-1 px-2 border-r-[1px] border-gray-200 rounded-t-r-full flex items-center gap-2"
                >
                {post.upvotes.includes(userId)?
                <BsFillArrowUpSquareFill size={15} color="#4f1179" />
                :
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
                <FaRegComment color="gray" />
                <span className='text-xs md:text-sm'>{post.comments.length}</span>
              </button>
              {
                post.userId === userId ? 
                  null :
                  <button className='flex items-center gap-2'>
                    {
                      post?.tweets.includes(userId) ? 
                      <FaRetweet onClick={()=>untweetPost(post._id, refetch, getUserProfileHandler)} color='#4f1179' size={20}/>
                      :
                      <FaRetweet onClick={()=>tweetPost(post._id, refetch)}  color='gray' size={20}/>
                    } 
                    <span className='text-xs md:text-sm'>{post.tweets.length}</span>

                  </button>
              }
            </div>
          </div>
          {/*  */}
          
          {/* Comment Section */}
          {
            open? (
              <div className='mt-2 w-full min-h-16'>
                <div className="mx-auto flex p-2 items-center dark:bg-[#060109] dark:mx-1 bg-[#f2e4fb] gap-2">
                  <Link to={`/profile/${post.userId}`}> 
                  <div className='w-8 h-8 rounded-full bg-black'>
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
                    className="h-4 flex-grow p-2 rounded-md bg-white text-[#060109] text-sm focus:text-sm outline-none"
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
                {loading?
                  <div className="">
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
                  </div>
                :
                  <div>
                    {comments?.map((comment, idx) => (
                      <Comment key={idx} comment={comment} getComment={getComment} postId={post._id}/>
                      ))}
                  </div>
                }
              </div>
            ) : ""
          }
          
          {/*  */}

        </div>
    </div>
  )
}

export default Feed












































