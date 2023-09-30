import { useEffect, useState } from "react";
import { getUserId, getUserProfile } from "../../../api/api";
import { fetchFollowingOrbits } from "../../../api/orbit/orbit";
import Following from "./Following";
import SideBar from "../../common/SideBar";
import { ThreeDots } from "react-loader-spinner";
import RightBar from "../../common/RightBar";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

function Followings() {
  const userId = getUserId()
  const [followingsId, setFollowingsId] = useState(false); // Initialize with an empty string

  const getUserProfileHandler = async() =>{
    try {
      const response = await getUserProfile(userId)
      const orbitIds = response?.orbitFollowings
      setFollowingsId(orbitIds)
    } catch (error) {
      console.log(error)
    }
  }
  const {data, error, isError, isLoading} = useQuery(['followings', followingsId], ()=>fetchFollowingOrbits(followingsId),
  {
    enabled: !!followingsId, // Only enable the query when followingsId is available
    onLoad:true
  }
  )
  // Fetch and set the username when the component mounts
  useEffect(() => {
      getUserProfileHandler(userId)
  }, [userId]);
  console.log(error)
  if (isLoading) {
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
  if (isError) {
    return (
      <div className="w-full items-center justify-center flex">
        An Error Occurred
      </div>
    )
  }
  if(error?.message){
    return (
      <div className="w-full items-center justify-center flex">
        <Link to="/login" >Unauthorized Login</Link>
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