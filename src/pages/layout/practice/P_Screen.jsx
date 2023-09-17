import {  Tab, Tabs } from "@mui/material"
import { useState } from "react"
import P_Question from "./P_Question"
import { useLocation } from "react-router-dom";

function P_Screen() {
    const [tabValue, setTabValue] = useState(0)
    // Inside your component
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const level = params.get("level");
    const faculty = params.get("faculty");
    const course = params.get("course");
    console.log(level, faculty, course)
  return (
    <div className=' mx-auto'>
        <div className='bg-gray-300 h-64 w-full'></div>
        <div className="flex w-full justify-between border-b-[1px] overflow-y-scroll border-gray-300">
            <Tabs value={tabValue} className="overflow-y-scroll" onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="Practice" sx={{fontSize:10}} />
                <Tab label="Quiz" sx={{fontSize:10}} />
                <Tab label="Note" sx={{fontSize:10}} />
                <Tab label="PDF" sx={{fontSize:10}} />
            </Tabs>
        </div>
        {/*  */}
        {tabValue === 0 ? (
                <div className='w-full h-full md:p-3'>
                    {[0 , 1, 2, 3].map((item, idx)=>(
                        <P_Question key={idx} question={item} />
                    ))}
                </div>
            ) : tabValue === 1 ? (
                // Quiz Section
                <div className='w-full h-full md:p-3'>
                    <div className={`flex flex-col p-2 items-start md:w-[80%]`}>
                        <div className='flex mx-auto justify-between w-full items-center '>
                            <h2 className="text-md mb-2">Question  1</h2>
                            <button
                            className={` bg-green-500 text-white py-1 px-2 rounded`}
                            disabled={false}
                            >50/50</button>
                        </div>
                        <div>
                            <h3 className="font-semibold md:text-xl mb-4">The type of essay which gives a clear picture of people, events, situation is</h3>
                            {/* <img src="" alt="Question" className="mb-4" /> */}
                        </div>
                        <ul className='w-[100%]'>
                            <li
                                className={`mb-2 p-2 rounded-md w-[100%] bg-[#ff8f94]  border-2 border-white`}
                            >
                                <span>option answer</span>
                            </li>
                            <li
                                className={`mb-2 p-2 rounded-md w-[100%] bg-[#ff8f94]  border-2 border-white`}
                            >
                                <span>option answer</span>
                            </li>
                            <li
                                className={`mb-2 p-2 rounded-md w-[100%] bg-[#ff8f94]  border-2 border-white`}
                            >
                                <span>option answer</span>
                            </li>
                            <li
                                className={`mb-2 p-2 rounded-md w-[100%] bg-[#ff8f94]  border-2 border-white`}
                            >
                                <span>option answer</span>
                            </li>
                        </ul>
                        <div className='w-full justify-between flex items-center'>
                            <span className='bg-red-500 text-white text-xs py-1 px-2 rounded-md'>GNS 112</span>
                            <button
                            className={`py-2 px-4 rounded`}
                            disabled={false}
                            >
                            Next Question
                            </button>
                        </div>
                        <p className="mt-4">Time Remaining: 43 seconds</p>
                    </div>
                </div>
            ) : tabValue === 2 ? (
                // Lecture Note
                <div className='w-full h-full bg-green-500'>
                    <h2>Lecture Note</h2>
                </div>
            ) : (
                // PDF
                <div className='w-full h-full bg-orange-500 '>
                    <h2>PDF</h2>
                </div>
            )
        }
    </div>
)
}

export default P_Screen