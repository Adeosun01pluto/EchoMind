import { Link } from 'react-router-dom'
import { BASE_URL } from '../../../constants/constant'

function Following({following}) {
    const description = following?.description;
    const words = description.split(' ');
  
    const maxWords = 9;
    const truncatedDescription = words.slice(0, maxWords).join(' ');
  
    const displayDescription = words.length > maxWords ? `${truncatedDescription} ...` : description;
  
   return (
    <Link to={`/orbit/${following?._id}`} className=''>
        <div className='py-2 dark:bg-[#171517] shadow-lg bg-gray-50 px-3 my-1 rounded-md'>
            <div className="w-[100%] flex items-center gap-3 p-1 ">
                {/* <Avatar/> */}
                    <img className="rounded-lg w-12 h-12 object-cover" src={following?.coverPhoto ? `${BASE_URL}/images/${following?.coverPhoto}` : `/${following.tempCoverImage}.avif`} alt="" />
                <div>
                <div className="flex flex-col">
                    <span className="text-md font-bold">{following?.name}</span>
                    <span className="text-xs">{following?.followers?.length} followers</span>
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

export default Following