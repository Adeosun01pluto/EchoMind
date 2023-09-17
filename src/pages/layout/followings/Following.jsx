import {  Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../../../constants/constant'

function Following({following}) {
   return (
    <Link to={`/orbit/${following?._id}`}>
        <div className='py-2'>
            <Divider  light />
            <div className="w-[100%] flex gap-3 p-1 ">
                {/* <Avatar/> */}
                    <img className="rounded-lg w-12 h-12 object-cover" src={`${BASE_URL}/images/${following?.coverPhoto}`} alt="" />
                <div>
                <div className="flex flex-col">
                    <span className="text-md font-bold">{following?.name}</span>
                    <span className="text-sm ">{following?.followers?.length} followers</span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-sm">{following?.description}</span>
                </div>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default Following