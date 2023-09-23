import axios from 'axios';
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom';
import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill, BsSend} from 'react-icons/bs'
import { FaRegComment, FaRetweet} from 'react-icons/fa'
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import {  getUserProfile } from '../../../api/api';
import { BASE_URL } from '../../../constants/constant';
import Comment from '../../common/Comment';
import { downVote, follow, tweetPost, unfollow, untweetPost, upVote } from '../../../api/post/post';
import { ThreeDots } from 'react-loader-spinner';

function Feed({post, refetch}) {
  const [loading, setLoading] = useState(false); // Initialize with an empty string
  const [profile, setProfile] = useState(null); // Initialize with an empty string
  const [text, setText] = useState(''); // Initialize with an empty string
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);  
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
  const getUserProfileHandler = async(userId) =>{
    try {
      const response = await getUserProfile(userId)
      setProfile(response) 
    } catch (error) {
      console.log(error)
    }
  }
  const handleFollow = async (followerId) => {
    try {
      await follow(followerId, refetch);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleUnFollow = async (followerId) => {

    try {
      await unfollow(followerId, refetch);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch and set the username when the component mounts
  useEffect(() => {
      getUserProfileHandler(post.userId)
  }, [post.userId]);
  return (
    <div>
      <div  className="dark:bg-[#171517] bg-[white] shadow-md p-1 md:p-2 sm:rounded-sm my-2">
          {/* Post Header */}
          <div className="w-[100%] flex gap-2 py-1 md:gap-3 ">
              <Link to={`/profile/${post.userId}`}> 
              <div className='w-10 h-10 rounded-full bg-black'>
                <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profile?.profileImage}`} alt="" />
              </div>
              </Link>
              <div>
                  <div className="flex gap-2 items-center">
                      <span className="text-sm font-bold">{profile?.username}</span>
                      {userId === post.userId ? null : 
                      ( !profile?.followings.includes(userId) ? 
                      <span onClick={()=>handleFollow(post.userId)} className="dark:text-[#f2e4fb] text-[#8a1dd3] cursor-pointer text-xs">Follow</span>:
                      <span onClick={()=>handleUnFollow(post.userId)} className="dark:text-[#f2e4fb] text-[#8a1dd3] cursor-pointer text-xs">unfollow</span>
                      )
                      }
                  </div>
                  <div className="flex gap-2 items-center">
                      <span className='text-xs'>{formatDistanceToNow(Date.parse(post.createdAt))} ago</span>
                  </div>
              </div>
          </div>
          {/*  */}

          {/* Post Content */}
          <div className="dark:text-[#f2e4fb] text-[#060109] text-lg py-1 px-2">{post?.content}</div>
          {/*  */}

          {/* Post Actions */}
          <div className="flex items-center gap-6">
            {/* Render like/unlike button based on liked status */}
            <div className="flex items-center  bg-[#e3c5f7] text-[#060109] rounded-full">
              <button
                onClick={() => handleLike(post?._id)}
                className="p-1 px-2 border-r-2 border-gray-200 rounded-t-r-full flex items-center gap-2"
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
              <button className='flex items-center gap-2'>
                <FaRegComment color="gray" onClick={()=>handleClickOpen(post._id)} />
                <span className='text-xs md:text-sm'>{post.comments.length}</span>
              </button>
              <button className='flex items-center gap-2'>
                {
                  post?.tweets.includes(userId) ? 
                  <FaRetweet onClick={()=>untweetPost(post._id, refetch, getUserProfileHandler)} color='#4f1179' size={20}/>
                  :
                  <FaRetweet onClick={()=>tweetPost(post._id, refetch)}  color='gray' size={20}/>
                } 
                <span className='text-xs md:text-sm'>{post.tweets.length}</span>

              </button>
            </div>
          </div>
          {/*  */}
          
          {/* Comment Section */}
          {
            open? (
              <div className='mt-2 w-full min-h-16'>
                <div className="mx-auto rounded-md flex bg-gray-100 mb-2">
                  <Avatar className='homeAvatar'/>
                  <textarea
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-10 rounded-full w-[100%] p-2 bg-gray-100 text-sm outline-none"
                    placeholder="Add comment"
                  />
                  <BsSend
                    className="text-blue-500 cursor-pointer"
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







// import axios from 'axios';
// import { formatDistanceToNow } from 'date-fns'
// import { Link } from 'react-router-dom';
// import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill, BsSend} from 'react-icons/bs'
// import { FaRegComment, FaRetweet} from 'react-icons/fa'
// import { useEffect, useState } from 'react';
// import { Avatar } from '@mui/material';
// import {  getUserProfile } from '../../../api/api';
// import { BASE_URL } from '../../../constants/constant';
// import Comment from '../../common/Comment';
// import { upVote } from '../../../api/post/post';

// function Feed({post, refetch}) {
//   // const [username, setUsername] = useState(''); // Initialize with an empty string
//   const [profile, setProfile] = useState(null); // Initialize with an empty string
//   const [text, setText] = useState(''); // Initialize with an empty string
//   const [open, setOpen] = useState(false);
//   const [comments, setComments] = useState([]);  
//   const handleClickOpen = (postId) => {
//     getComment(postId)
//     setOpen(true);
//   };
//   const userId = localStorage.getItem('userId');
 
//   const tweetPost = async (postId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/tweet/${postId}`,
//         {}, // Request body can be empty for liking
//         {
//           headers: {
//             "Authorization" : token,
//           },
//         }
//       );
//       console.log(response.data)
//       refetch()
//       return response.data;
//     } catch (error) {
//       console.log(error)
//       }
//   };
//   const untweetPost = async (postId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/undo/${postId}`,
//         {}, // Request body can be empty for liking
//         {
//           headers: {
//             "Authorization" : token,
//           },
//         }
//       );
//       console.log(response.data)
//       refetch()
//       return response.data;
//     } catch (error) {
//       console.log(error)
//       }
//   };
//   const unlikePost = async (postId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/${postId}/downvote`,
//         {}, // Request body can be empty for unliking
//         {
//           headers: {
//             "Authorization" : token,
//           },
//         }
//       );
//       refetch()
//       return response.data;
//     } catch (error) {
//       console.log(error)
//     }
//   };
//   const handleLike = async (postId) => {
//     try {
//       await upVote(postId, refetch);
//       // Update the liked status for the post
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const handleUnlike = async (postId) => {
//     try {
//       await unlikePost(postId);
//       // Update the liked status for the post

//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const createComment = async (postId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/create_comment/${postId}`,
//         {text}, // Request body can be empty for liking
//         {
//           headers: {
//             "Authorization" : token,
//           },
//         }
//       );
//       setText("")
//       getComment(postId)
//       refetch()
//       return response.data;
//     } catch (error) {
//       console.log(error)
//       }
//   };
//   const getComment = async (postId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(
//         `${BASE_URL}/get_comments/${postId}`,
//         {
//           headers: {
//             "Authorization" : token,
//           },
//         }
//       );
//       setComments(response.data.comments)
//       return response.data;
//     } catch (error) {
//       console.log(error)
//       }
//   };
//   const follow = async (followerId) => {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/auth/follow/${followerId}`,
//         {
//             headers: {
//               "Authorization" : token,
//             },
//           }
//         );
//         refetch()
//         return response.data;
//       } catch (error) {
//        console.log(error)
//       }
//   };
  
//   const unfollow = async (followerId) => {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/auth/un_follow/${followerId}`,
//         {
//             headers: {
//               "Authorization" : token,
//             },
//           }
//         );
//         refetch()
//         return response.data;
//       } catch (error) {
//         console.log(error)
//       }
//   };
//   const handleFollow = async (followerId) => {
//     try {
//       await follow(followerId, refetch);
//       // Update the liked status for the post
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
//   const handleUnFollow = async (followerId) => {
//     try {
//       await unfollow(followerId);
//       // Update the liked status for the post
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   // Fetch and set the username when the component mounts
//   useEffect(() => {
//       getUserProfile(post.userId)
//       .then((result) => {
//         setProfile(result)
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, [post.userId]);
//   return (
//     <div>
//       <div  className="bg-white shadow-md p-1 md:p-2 sm:rounded-sm my-2">
//           {/* Post Header */}
//           <div className="w-[100%] flex gap-2 py-2 md:gap-3 ">
//               <Link to={`/profile/${post.userId}`}> 
//               <div className='w-10 h-10 rounded-full bg-black'>
//                 <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profile?.profileImage}`} alt="" />
//               </div>
//               </Link>
//               <div>
//                   <div className="flex gap-2 items-center">
//                       <span className="text-sm font-bold">{profile?.username}</span>
//                       {userId === post.userId ? null : 
//                       ( !profile?.followings.includes(userId) ? 
//                       <span onClick={()=>handleFollow(post.userId)} className="text-green-500 cursor-pointer text-xs">Follow</span>:
//                       <span onClick={()=>handleUnFollow(post.userId)} className="text-blue-500 cursor-pointer text-xs">unfollow</span>
//                       )
//                       }
//                   </div>
//                   <div className="flex gap-2 items-center">
//                       <span>{formatDistanceToNow(Date.parse(post.createdAt))} ago</span>
//                   </div>
//               </div>
//           </div>
//           {/*  */}

//           {/* Post Content */}
//           <div className="text-gray-600 py-2">{post?.content}</div>
//           {/*  */}

//           {/* Post Actions */}
//           <div className="flex items-center gap-6">
//             {/* Render like/unlike button based on liked status */}
//             <div className="flex items-center bg-gray-100 border-2 border-gray-200 rounded-full">
//               <button
//                 onClick={() => handleLike(post?._id)}
//                 className="p-1 px-2 border-r-2 border-gray-200 rounded-t-r-full flex items-center gap-2"
//               >
//                 {
//                   post?.upvotes.includes(userId) ?
//                   <BsFillArrowUpSquareFill size={15} color="green" /> : 
//                   <BsFillArrowUpSquareFill size={15} color="blue" />
//                 }
//                 <span className='text-sm'>Upvote . {post.upvotes.length}</span>
//               </button>
//               <button
//                 onClick={() => handleUnlike(post?._id)}
//                 className="p-1 px-2 rounded flex items-center gap-2 "
//               >
//                 <BsFillArrowDownSquareFill size={15} color="black" />
//                 <span className='text-sm'>{post.downvotes.length}</span>
//               </button>
//             </div>
//             {/* Render the tweet and untweet btn */}
//             <div className='flex items-center gap-4'>
//               <button className='flex items-center gap-2'>
//                 <FaRegComment onClick={()=>handleClickOpen(post._id)} />
//                 <span>{post.comments.length}</span>
//               </button>
//               <button className='flex items-center gap-2'>
//                 {
//                   post?.tweets.includes(userId) ? 
//                   <FaRetweet onClick={()=>untweetPost(post._id)} color='green'/>
//                   :
//                   <FaRetweet onClick={()=>tweetPost(post._id)}  color='blue'/>
//                 } 
//                 <span>{post.tweets.length}</span>

//               </button>
//             </div>
//           </div>
//           {/*  */}
          
//           {/* Comment Section */}
//           {
//             open? (
//               <div className='mt-2 w-full min-h-16'>
//                 <div className="mx-auto flex bg-gray-100 mb-2">
//                   <Avatar className='homeAvatar'/>
//                   <textarea
//                     type="text"
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     className="h-10 rounded-full w-[100%] p-2 bg-gray-100 text-sm outline-none"
//                     placeholder="Add comment"
//                   />
//                   <BsSend
//                     className="text-blue-500 cursor-pointer"
//                     onClick={()=>createComment(post._id)}
//                   />
//                 </div>
//                 {/* getComment(postId) */}
//                 <div>
//                   {comments?.map((comment, idx) => (
//                     <Comment key={idx} comment={comment} getComment={getComment} postId={post._id}/>
//                   ))}
//                 </div>
//               </div>
//             ) : ""
//           }
          
//           {/*  */}

//         </div>
//     </div>
//   )
// }

// export default Feed