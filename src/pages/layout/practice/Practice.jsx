import { Link, } from "react-router-dom"

function Practice() {
  return (
    <div className="h-[60vh] w-[50%] bg-gray-100 mx-auto grid grid-cols-3 gap-3 pt-[30px]">
      <Link to={`100`} className="p-3 rounded-md bg-gray-600 text-white">100</Link>
      <Link to={`200`} className="p-3 rounded-md bg-gray-600 text-white">200</Link>
      <Link to={`300`} className="p-3 rounded-md bg-gray-600 text-white">300</Link>
      <Link to={`400`} className="p-3 rounded-md bg-gray-600 text-white">400</Link>
      <Link to={`500`} className="p-3 rounded-md bg-gray-600 text-white">500</Link>
      <Link to={`600`} className="p-3 rounded-md bg-gray-600 text-white">600</Link>
    </div>
  )
}

export default Practice