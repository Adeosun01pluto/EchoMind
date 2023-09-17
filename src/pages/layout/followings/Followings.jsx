import { useEffect, useState } from "react";
import { getUserId, getUserProfile } from "../../../api/api";
import { fetchFollowingOrbits } from "../../../api/orbit/orbit";
import Following from "./Following";

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
  if(loading) "Loading"
  return (
    <div className="container md:w-[55%] bg-gray-50 mx-auto">
      <div>
        {data?.map((following, idx)=> (
          <Following key={idx} following={following} />
        ))}
      </div>
    </div>
  )
}

export default Followings