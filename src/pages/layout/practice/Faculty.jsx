import { Link, useParams } from "react-router-dom"

function Faculty() {
    const {level} = useParams()
    const faculty = [
        {
          title:"Engineering and Technology",
          link:"engineering_and_technology"
        },
        {
          title:"Physical Sciences",
          link:"physical_sciences"
        },
        {
          title:"Live Science",
          link:"live_sciences"
        },
        {
          title:"Management Science",
          link:"management_sciences"
        },
        {
          title:"Medical Science",
          link:"medical_sciences"
        },
        
    ]
  return (
    <div className="h-[60vh] w-[50%] bg-gray-100 mx-auto grid grid-cols-3 gap-3 pt-[30px]">
        {faculty.map((item, idx)=>(
            <Link key={idx} to={`/practice/${level}/${item.link}`} className="p-3 rounded-md bg-gray-600 text-white">{item.title}</Link>
        ))}
     
    </div>
  )
}

export default Faculty