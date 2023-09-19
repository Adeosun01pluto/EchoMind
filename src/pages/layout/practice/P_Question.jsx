import { Divider } from "@mui/material"
import { RiHeartFill } from "react-icons/ri"
import Latex from 'react-latex'

function P_Question({question, idx}) {
  return (
    <div>
        <div className={`min-h-64 w-[100%] p-2 flex flex-col justify-center gap-2`}>                        
                        <div className='flex justify-between'>
                            <h2 className=" text-md">Question {idx +1}</h2>
                            <button className=' cursor-pointer'><RiHeartFill color="#8fb4ff" size={30}/></button>
                        </div>
                        {/* <div>
                            <img src="" alt="" />
                        </div> */}
                        <div className=" text-lg md:text-xl font-semibold text-[#000] ">
                            <p><Latex>{question.question_text[0]}</Latex></p>
                        </div>
                        {/* <h3 className="text-black text-lg sm:text-xl">Options</h3> */}
                        {question.options?.map((item, idx)=>(
                            <div key={idx} className="flex gap-2 items-center option text-lg "><span>{item.opt} </span><Latex>{item.answer}</Latex></div>
                        ))}
                        <div className='flex gap-2 items-center self-start p-1 rounded-sm text-xs sm:text-md text-white font-semibold bg-green-600'>{question.course}</div>
                        <div className="related">Related Lessons: <span className='text-[#f50057]'>Essay</span></div>
                        <div className="text-lg font-light"> explanationMsg</div>
                        {/* <div className= "flex gap-2 sm:gap-4 flex-wrap">
                            <button className= {`py-2 rounded-sm px-2 sm:px-4 text-sm sm:text-md `}>Show Answer</button>
                        </div> */}
                        <Divider />
        </div>
    </div>
  )
}

export default P_Question