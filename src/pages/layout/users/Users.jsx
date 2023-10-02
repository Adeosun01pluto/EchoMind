import RightBar from "../../common/RightBar"
import SideBar from "../../common/SideBar"

function Users() {
  return (
    <div className="w-full dark:text-[#f2e4fb] text-[#060109] gap-2 md:gap-4  mx-auto p-2 md:p-4 flex flex-col md:flex-row">
      {/* <SideBar /> */}
      <div className="md:w-2/12 fixed hidden md:block"> {/* Sidebar */}
        <SideBar />
      </div>

      <div className="main_bar md:w-6/12 w-full">
        {/* {[1,0,0]?.map((following, idx)=> (
          <User key={idx} following={following} />
        ))} */}
      </div>
      
      <div className="md:w-4/12 hidden md:block"> {/* Right Sidebar */}
        <RightBar />
      </div>
      {/* <RightBar /> */}
    </div>
  )
}

export default Users