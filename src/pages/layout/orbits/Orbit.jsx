import { Link } from "react-router-dom"
import { BASE_URL } from "../../../constants/constant"

function Orbit({orbit}) {
  const coverPhoto = orbit.coverPhoto 
  const iconImage = orbit.iconImage 
  const tempIconImage = orbit.tempIconImage 
  const tempCoverImage = orbit.tempCoverImage 
  const description = orbit.description;
  const words = description.split(' ');

  const maxWords = 8;
  const truncatedDescription = words.slice(0, maxWords).join(' ');

  const displayDescription = words.length > maxWords ? `${truncatedDescription} ...` : description;

  return (
    <Link to={`/orbit/${orbit._id}`} className='my-2 w-[100%] dark:bg-[#171517] bg-[#f2e4fb] min-h-[250px] rounded-lg'>
      <div className='w-[100%] bg-[#4f1179] h-[100px] rounded-md'>
        <img className="w-full h-full rounded-md object-cover" src={coverPhoto ? `${BASE_URL}/images/${orbit.coverPhoto}` : `/${tempCoverImage}.avif`} alt="" />
      </div>
      <div className='flex items-center gap-2 p-2 flex-col w-[100%] mt-[-30px]'>
        <img className="w-12 rounded-lg h-12 bg-black object-cover" src={iconImage ? `${BASE_URL}/images/${orbit.iconImage}` : `/${tempIconImage}.avif`} alt="" />
        <div className='flex flex-col items-center w-[100%]'>
          <p className='text-center w-[90%] font-semibold'>{orbit.name}</p>
          <p className='text-center w-[90%] text-gray-500 text-sm font-light'>{displayDescription}</p>
        </div>
      </div>
    </Link>
  )
}

export default Orbit