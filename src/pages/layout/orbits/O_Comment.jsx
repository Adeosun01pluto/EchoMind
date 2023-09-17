// import axios from "axios";
// import { formatDistanceToNow } from "date-fns"
// import { useEffect, useState } from "react";
// import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill } from "react-icons/bs";
// import { Link } from "react-router-dom";
// import Reply from "./Reply";
// import { getUserProfile } from "../../../api/api";
// import { BASE_URL } from "../../../constants/constant";

// function O_Comment({comment, getComment, postId}) {
//     const userId = localStorage.getItem('userId');
//     const [profile, setProfile] = useState(''); // Initialize with an empty string
//     const [open, setOpen] = useState(false); // Initialize with an empty string
//     const [reply, setReply] = useState(""); // Initialize with an empty string
//     const [replies, setReplies] = useState(null); // Initialize with an empty string
//       // Fetch and set the username when the component mounts
//   useEffect(() => {
//     getUserProfile(comment.userId)
//       .then((result) => {
//         setProfile(result);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, [comment.userId]);

//   const likePost = async (commentId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/${commentId}/upvote_comment`,
//         {}, // Request body can be empty for liking
//         {
//           headers: {
//             "Authorization" : token,
//           },
//         }
//       );
//       getComment(commentId)
//       return response.data;
//     } catch (error) {
//       console.log(error)
//     }
//   };
//   const unlikePost = async (commentId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/${commentId}/downvote_comment`,
//         {}, // Request body can be empty for unliking
//         {
//           headers: {
//             "Authorization" : token,
//           },
//         }
//       );
//       getComment(postId)
//       return response.data;
//     } catch (error) {
//       console.log(error)
//     }
//   };
//   const handleLike = async (commentId) => {
//     try {
//       await likePost(commentId);
//       // Update the liked status for the post
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const handleUnlike = async (commentId) => {
//     try {
//       await unlikePost(commentId);
//       // Update the liked status for the post

//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const handleClickOpen = (commentId) =>{
//     setOpen(true)
//     getReplies(commentId)
//   }
//   const handleReply = async(commentId) => {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await axios.post(
//           `${BASE_URL}/${commentId}/reply_comment`,
//           {reply}, // Request body can be empty for liking
//           {
//             headers: {
//               "Authorization" : token,
//             },
//           }
//         );
//         getReplies(commentId)
//         setReply("")
//         return response.data;
//       } catch (error) {
//         console.log(error)
//       }
//   }
//   const getReplies = async (commentId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(
//         `${BASE_URL}/${commentId}/get_replies`,
//         {
//           headers: {
//             "Authorization" : token,
//           },
//         }
//       );
//       setReplies(response.data.comments)
//       return response.data;
//     } catch (error) {
//       console.log(error)
//       }
//   };
//   return (
//     <div className="border-b-2 border-gray-200 py-2">
//         {/* Comment Header */}
//         <div className="w-[100%] flex gap-2 md:gap-3 ">
//             <Link to={`/profile/${comment.userId}`}> 
//               <div className='w-10 h-10 rounded-full bg-black'>
//                 <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profile?.profileImage}`} alt="" />
//               </div>
//             </Link>
//             <div className="w-full">
//                 <div className="flex flex-col gap-2 ">
//                     <div className="flex gap-2 items-center">
//                         <span className="text-sm font-bold">{profile?.username}</span>
//                         <span className="text-red text-xs text-blue-500">Follow</span>
//                         <span className="hover:underline text-sm">{formatDistanceToNow(Date.parse(comment.createdAt))}</span>
//                     </div>
//                     <div className="flex gap-2 items-center">
//                         {comment.text}
//                     </div>
//                     {/* Post Actions */}
//                     <div className="flex items-center gap-6">
//                         {/* Render like/unlike button based on liked status */}
//                         <div className="flex items-center bg-gray-100 border-2 border-gray-200 rounded-full">
//                         <button
//                             onClick={() => handleLike(comment?._id)}
//                             className="p-1 px-2 border-r-2 border-gray-200 rounded-t-r-full flex items-center gap-2"
//                         >
//                             {
//                             comment?.upvotes.includes(userId) ?
//                             <BsFillArrowUpSquareFill size={15} color="green" /> : 
//                             <BsFillArrowUpSquareFill size={15} color="blue" />
//                             }
//                             <span className='text-sm'>{comment.upvotes.length}</span>
//                         </button>
//                         <button
//                             onClick={() => handleUnlike(comment?._id)}
//                             className="p-1 px-2 rounded flex items-center gap-2 "
//                         >
//                             <BsFillArrowDownSquareFill size={15} color="black" />
//                             <span className='text-sm'>{comment.downvotes.length}</span>
//                         </button>
//                         </div>
//                         <button className='flex items-center gap-2'>
//                             <span onClick={()=>handleClickOpen(comment._id)} className="cursor-pointer text-sm text-gray-500 hover:underline">Reply</span>
//                         </button>

//                     </div>
//                     {
//                         !open? null : 
//                         <div className="w-full flex gap-1 h-8">
//                             <input type="text" value={reply} onChange={(e)=>setReply(e.target.value)} className="w-full text-sm rounded-full border-[1px] px-3 border-gray-300 p-1 " placeholder="Add a reply" />
//                             <button onClick={()=>handleReply(comment._id)} className="bg-blue-400 py-1 px-3 text-sm rounded-full text-white">Reply</button>
//                         </div>
//                     }

//                     {/*Reply  */}
//                     <div className="">
//                         {replies?.map((reply,idx)=>(
//                            <Reply key={idx} reply={reply} getReplies={getReplies} commentId={comment._id} />
//                         ))}
//                     </div>
//               </div>
//         </div>
//         </div>
//     </div>
//   )
// }

// export default O_Comment