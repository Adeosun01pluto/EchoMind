import { Link } from "react-router-dom"

function Orbit({orbit}) {
  // const coverPhoto = orbit.coverPhoto 
  // const iconImage = orbit.iconImage 
  // const tempIconImage = orbit.tempIconImage 
  // const tempCoverImage = orbit.tempCoverImage 
  const description = orbit.description;
  const words = description.split(' ');

  const maxWords = 8;
  const truncatedDescription = words.slice(0, maxWords).join(' ');

  const displayDescription = words.length > maxWords ? `${truncatedDescription} ...` : description;

  return (
    <Link to={`/orbit/${orbit._id}`} className='my-2 w-[100%] bg-[white] min-h-[250px] rounded-lg'>
      <div className='w-[100%] bg-[green] h-[100px] rounded-md'>
        <img className="w-full h-full rounded-md object-cover" src={`http://localhost:4001/images/${orbit.coverPhoto}`} alt="" />
      </div>
      <div className='flex items-center gap-2 p-2 flex-col w-[100%] mt-[-50px]'>
        <img className="w-16 rounded-lg h-16 bg-black object-cover" src={`http://localhost:4001/images/${orbit.iconImage}`} alt="" />
        <div className='flex flex-col items-center w-[100%]'>
          <p className='text-center w-[90%] font-semibold'>{orbit.name}</p>
          <p className='text-center w-[90%] text-gray-500 text-sm font-light'>{displayDescription}</p>
        </div>
      </div>
    </Link>
  )
}

export default Orbit