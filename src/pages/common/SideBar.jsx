import { useEffect, useState } from "react";
import { fetchFollowingOrbits } from "../../api/orbit/orbit";
import { getUserId, getUserProfile } from "../../api/api";
import { Link } from "react-router-dom";
import { Divider } from "@mui/material";
import { BASE_URL } from "../../constants/constant";
import "../../App.css"

function SideBar() {
    const userId = getUserId()
    const [data, setData] = useState(null); // Initialize with an empty string
    const [loading, setLoading] = useState(false); // Initialize with an empty string
    const getUserProfileHandler = async() =>{
      setLoading(true)
      try {
        const response = await getUserProfile(userId)
        const orbitIds = response.orbitFollowings
        const res = await fetchFollowingOrbits(orbitIds)
        setData(res)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
      // Fetch and set the username when the component mounts
    useEffect(() => {
        getUserProfileHandler(userId)
    }, [userId]);
    if(loading) "Loading"
  return (
    <div className="h-full side_bar">
         <div className="  mx-auto">
            <ul className='flex flex-col rounded-sm mx-auto'>
                {data?.map((datum, idx)=>(
                <div key={idx} className="h-12 hover:bg-gray-100 rounded-md ">
                    <Link to={`/orbit/${datum._id}`} className='p-2 flex gap-2 cursor-pointer items-center py-3'>
                        <img className="rounded-md w-8 h-8 object-cover" src={`${BASE_URL}/images/${datum?.coverPhoto}`} alt="" />
                        <span className='text-md'>{datum?.name}</span>
                    </Link>
                </div>
                ))}
            </ul>
            <Divider light className='py-2'/>
            <ul className='flex flex-col pt-4 w-[90%] mx-auto'>
                <li className='text-gray-500 text-sm cursor-pointer'>About</li>
                <li className='text-gray-500 text-sm cursor-pointer'>Terms</li>
                <li className='text-gray-500 text-sm cursor-pointer'>Privacy</li>
                <li className='text-gray-500 text-sm cursor-pointer'>Your Ad choice</li>
                </ul>
            </div>
    </div>
  )
}

export default SideBar