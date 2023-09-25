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
        const orbitIds = response?.orbitFollowings
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
    <div className="h-full p-2 side_bar dark:bg-[#171517] bg-[#f2e4fb]">
         <div className="">
            <ul className='w-full flex flex-col rounded-sm mx-auto '>
                {data?.map((datum, idx)=>(
                <div key={idx} className="h-12 rounded-md ">
                    <Link to={`/orbit/${datum._id}`} className='lg:p-2 flex gap-2 cursor-pointer items-center py-3 w-[100%] '>
                        <img className="rounded-md h-8 object-cover w-[15%] sm:w-[25%]" src={datum?.coverPhoto ? `${BASE_URL}/images/${datum?.coverPhoto}` : `/${datum?.tempCoverImage}.avif`} alt="" />
                        <span className=' text-sm  flex-1 lg:text-md'>{datum?.name}</span>
                    </Link>
                </div>
                ))}
            </ul>
            <Divider light className='py-2'/>
            <ul className='flex flex-col pt-4 w-[90%] mx-auto'>
                <li className=' text-sm cursor-pointer'>About</li>
                <li className='text-sm cursor-pointer'>Terms</li>
                <li className='text-sm cursor-pointer'>Privacy</li>
                <li className='text-sm cursor-pointer'>Your Ad choice</li>
                </ul>
            </div>
    </div>
  )
}

export default SideBar