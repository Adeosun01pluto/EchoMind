import { Link, useParams } from "react-router-dom"

function Courses() {
    const {level, faculty} = useParams()
    const courses = [
        {
          title:"PHY 191 ",
          link:"phy_191"
        },
        {
          title:"PHY 125",
          link:"phy_125"
        },
        {
          title:"CHM 115",
          link:"chm_115"
        },
        {
          title:"MAT 111",
          link:"mat_111"
        },
        {
          title:"MAT 113",
          link:"mat_113"
        },
        {
          title:"GNS 112",
          link:"gns_112"
        },
    ]
  return (
    <div className="h-[60vh] w-full mx-auto grid grid-cols-3 gap-3">
        {courses.map((item, idx)=>(
            <Link key={idx} to={`/practice/${level}/${faculty}/${item.link}`} className="p-3 rounded-md bg-gray-600 text-white">{item.title}</Link>
        ))}
     
    </div>
  )
}

export default Courses

{/* <Link
            key={idx}
            to={`/practice?level=${level}&faculty=${faculty}&course=${item.link}`}
            className="p-3 rounded-md bg-gray-600 text-white"
            onClick={() => navigate(`/practice?level=${level}&faculty=${faculty}&course=${item.link}`)}
          >
            {item.title}
          </Link> */}