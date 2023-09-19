import { useEffect, useState } from "react";
import { getUserId, getUserProfile } from "../../../api/api";
import { fetchFollowingOrbits } from "../../../api/orbit/orbit";
import Following from "./Following";
import SideBar from "../../common/SideBar";
import { ThreeDots } from "react-loader-spinner";

function Followings() {
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
  if (loading) {
    return (
      <div className="w-full items-center justify-center flex">
        <ThreeDots 
          height="80" 
          width="50" 
          radius="9"
          color="gray" 
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
          />
      </div>
    )
  }
  return (
    <div className="w-full grid grid-cols-12 gap-4 mx-auto p-2 md:p-4">
      <div className='sm:col-span-4 md:col-span-3'>
        <SideBar />
      </div>

      <div className=" col-span-12 sm:col-span-8 md:col-span-6 lg:col-span-5 ">
        {data?.map((following, idx)=> (
          <Following key={idx} following={following} />
        ))}
      </div>
      <div className='md:col-span-3 lg:col-span-4 bg-black'></div>

    </div>
  )
}

export default Followings