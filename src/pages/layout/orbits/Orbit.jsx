import { Link } from "react-router-dom"

function Orbit({orbit}) {
  // const coverPhoto = orbit.coverPhoto 
  // const iconImage = orbit.iconImage 
  // const tempIconImage = orbit.tempIconImage 
  // const tempCoverImage = orbit.tempCoverImage 
  return (
    <Link to={`/orbit/${orbit._id}`} className='w-[100%] bg-[white] min-h-[400px] rounded-lg'>
      <div className='w-[100%] bg-[green] h-[200px] rounded-md'>
        <img className="w-full h-full rounded-md object-cover" src={`http://localhost:4001/images/${orbit.coverPhoto}`} alt="" />
      </div>
      <div className='flex items-center gap-2 p-2 flex-col w-[100%] mt-[-50px]'>
        <img className="w-24 rounded-lg h-24 bg-black object-cover" src={`http://localhost:4001/images/${orbit.iconImage}`} alt="" />
        <div className='flex flex-col items-center w-[100%]'>
          <p className='text-center w-[90%] font-semibold text-lg'>{orbit.name}</p>
          <p className='text-center w-[90%] text-gray-500'>{orbit.description}</p>
        </div>
      </div>
    </Link>
  )
}

export default Orbit