import { Divider } from "@mui/material"
import { getUserProfile } from "../../../api/api";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../constants/constant";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

function Answer({answer}) {
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
                        {profile?.profileImage ? 
                            <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${profile?.profileImage}`} alt="" />
                            :
                            <img className="rounded-full w-full h-full object-cover" src={profile?.avatarData} alt />
                        }
                      </div>
                      </Link>
                      <div>
                          <div className='flex gap-1 items-center dark:text-gray-300 text-gray-600'>
                            <span className="text-sm font-bold">{profile?.fullname}</span>
                            <Link to={`/profile/${answer.userId}`} className="text-xs hover:underline font-bold">@{profile?.username}</Link>
                          </div>
                          <div className="flex gap-2 items-center">
                              <span className='text-xs dark:text-gray-500 text-gray-600'>{formatDistanceToNow(Date.parse(answer.createdAt))} ago</span>
                          </div>
                          </div>
                  </div>
                  {/*  */}
                  {/* Post Content */}
                  <div className="dark:text-gray-300 pb-2 text-md text-gray-600 font-semibold px-2">{answer?.answer}</div>
                  {/*  */}
                  <Divider />
                </div>
  )
}

export default Answer