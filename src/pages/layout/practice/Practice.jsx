import {  Outlet, } from "react-router-dom"
import SideBar from "../../common/SideBar"

function Practice() {

  return (
    <div className="w-full grid grid-cols-12 gap-4 bg-[#e0e0e0] mx-auto min-h-screen p-2 md:p-4">

      <div className='sm:col-span-4 md:col-span-3'>
        <SideBar />
      </div>
      <div className="col-span-12 sm:col-span-9 bg-white md:col-span-6 lg:col-span-7">
        <Outlet />
      </div>
    </div>
  )
}

export default Practice