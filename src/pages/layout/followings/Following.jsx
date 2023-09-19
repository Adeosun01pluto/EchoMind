import { Link } from 'react-router-dom'
import { BASE_URL } from '../../../constants/constant'

function Following({following}) {
   return (
    <Link to={`/orbit/${following?._id}`} className=''>
        <div className='py-2 dark:bg-[#171517] bg-[#f2e4fb] my-1 rounded-md'>
            <div className="w-[100%] flex gap-3 p-1 ">
                {/* <Avatar/> */}
                    <img className="rounded-lg w-12 h-12 object-cover" src={`${BASE_URL}/images/${following?.coverPhoto}`} alt="" />
                <div>
                <div className="flex flex-col">
                    <span className="text-md font-bold">{following?.name}</span>
                    <span className="text-xs">{following?.followers?.length} followers</span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold">{following?.description}</span>
                </div>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default Following