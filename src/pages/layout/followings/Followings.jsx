import { useEffect, useState } from "react";
import { getUserId, getUserProfile } from "../../../api/api";
import { fetchFollowingOrbits } from "../../../api/orbit/orbit";
import Following from "./Following";
import SideBar from "../../common/SideBar";
import { ThreeDots } from "react-loader-spinner";
import RightBar from "../../common/RightBar";

function Followings() {
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
    <div className="w-full dark:text-[#f2e4fb] text-[#060109] gap-2 md:gap-4  mx-auto p-2 md:p-4 flex flex-col md:flex-row">
      {/* <SideBar /> */}
      <div className="md:w-2/12 fixed hidden md:block"> {/* Sidebar */}
        <SideBar />
      </div>

      <div className="main_bar md:w-6/12 w-full">
        {data?.map((following, idx)=> (
          <Following key={idx} following={following} />
        ))}
      </div>
      
      <div className="md:w-4/12 hidden md:block"> {/* Right Sidebar */}
        <RightBar />
      </div>
      {/* <RightBar /> */}
    </div>
  )
}

export default Followings