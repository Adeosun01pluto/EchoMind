import { Avatar } from "@mui/material"
import { useEffect, useState } from "react"
import axios from 'axios';
import { BASE_URL } from "../../../constants/constant";

function Conversation({online, data, currentUser}) {
    const [userData, setUserData] = useState(null)
    useEffect(()=> {

        const userId = data.members.find((id)=>id!==currentUser)
        const getUserData = async ()=> {
          try
          {
            try {
                const response = await axios.get(`${BASE_URL}/auth/profile/${userId}`,  {
                  headers: {
                    "Authorization": localStorage.getItem('token'),
                  },
                });
                // console.log(response.data.userProfile)
                setUserData(response.data.userProfile)
              } catch (error) {
                console.log(error)
              }
            //  dispatch({type:"SAVE_USER", data:data})
          }
          catch(error)
          {
            console.log(error)
          }
        }
    
        getUserData();
      }, [])
  return (
    <div className="flex items-center gap-1">
        <Avatar />
        <div className="name" style={{fontSize: '0.8rem'}}>
            <span>{userData?.fullname}</span>
            <span style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span>
        </div>
        {/* <p>{chat.fullname}</p> */}
    </div>
  )
}

export default Conversation