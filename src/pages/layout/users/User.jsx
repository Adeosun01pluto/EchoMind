import { Link } from 'react-router-dom'
import { BASE_URL } from '../../../constants/constant'

function User({user}) {
    const bio = user?.bio;
    const words = bio?.split(' ');
  
    const maxWords = 9;
    const truncatedDescription = words?.slice(0, maxWords).join(' ');
  
    const displayDescription = words?.length > maxWords ? `${truncatedDescription} ...` : bio;
  
   return (
    <Link to={`/profile/${user?._id}`} className=''>
        <div className='py-2 dark:bg-[#171517] shadow-lg bg-gray-50 px-3 border-[1px]'>
                <div className="w-[100%] flex items-center gap-3 p-1 ">
                {/* <Avatar/> */}
                {user?.profileImage ? 
                      <img className="rounded-full w-8 h-8 object-cover" src={`${BASE_URL}/images/${user?.profileImage}`} alt="" />
                      :
                      <img className="rounded-full w-8 h-8 object-cover" src={user?.avatarData} alt />
                      }
                <div>
                <div className="flex flex-col">
                    <div className='flex gap-1 items-center'>
                        <span className="text-sm font-bold">{user?.fullname}</span>
                        <div className="text-xs hover:underline dark:text-gray-300 text-gray-600 font-bold">@{user?.username}</div>
                    </div>
                    <span className="text-xs">{user?.followers?.length} followers</span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold">{displayDescription}</span>
                </div>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default User