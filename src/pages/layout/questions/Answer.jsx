import { Divider } from "@mui/material"
import { getUserProfile } from "../../../api/api";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../constants/constant";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

function Answer({answer}) {
    const userId = localStorage.getItem('userId');
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        getUserProfile(answer.userId)
        .then((result) => {
          setProfile(result)
        })
        .catch((error) => {
          console.error(error);
        });
      }, [answer.userId]);
  return (
    <div className=''>
                  {/* Post Header */}
                  <div className="w-[100%] flex gap-2 p-2 py-2 md:gap-3 ">
                      <Link to={`/profile/${answer.userId}`}> 
                      <div className='w-8 h-8 rounded-full bg-black'>
                        <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profile?.profileImage}`} alt="" />
                      </div>
                      </Link>
                      <div>
                          <div className="flex gap-2 items-center">
                              <span className="text-sm font-bold">{profile?.username}</span>
                              {userId === answer.userId ? null : 
                                ( !profile?.followings.includes(userId) ? 
                              // <span onClick={()=>handleFollow(answer.userId)} className="text-green-500 cursor-pointer text-xs">Follow</span>:
                              // <span onClick={()=>handleUnFollow(answer.userId)} className="text-blue-500 cursor-pointer text-xs">unfollow</span>
                              <span className="text-green-500 cursor-pointer text-xs">Follow</span>:
                              <span className="text-blue-500 cursor-pointer text-xs">unfollow</span>
                              )
                            }
                          </div>
                          <div className="flex gap-2 items-center">
                              <span className='text-xs'>{formatDistanceToNow(Date.parse(answer.createdAt))} ago</span>
                          </div>
                          </div>
                  </div>
                  {/*  */}
                  {/* Post Content */}
                  <div className="text-gray-600 px-2">{answer?.answer}</div>
                  {/*  */}
                  <Divider />
                </div>
  )
}

export default Answer