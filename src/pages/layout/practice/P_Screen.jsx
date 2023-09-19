import {  MenuItem, Tab, Tabs, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import P_Question from "./P_Question"
import { useNavigate, useParams} from "react-router-dom";
import { useQuery } from "react-query";
import { fetchP_Questions, fetchP_Quiz } from "../../../api/practice/practice";
import { ThreeDots } from "react-loader-spinner";


function P_Screen() {
    const [tabValue, setTabValue] = useState(0)
    // Inside your component
    const { level, faculty, course} = useParams()
    const { data:questions, isLoading, refetch } = useQuery(['p_questions', course], ()=>fetchP_Questions(level, faculty, course), {
        enabled: false
    });
    const { data:quizData} = useQuery(['p_quiz', course], ()=>fetchP_Quiz(level, faculty, course), {
        enabled: false
    });
    console.log(quizData)
    const navigate = useNavigate()
    
    const [courses] = useState([
        {category:'Mat 111', value:1, name:"mat_111"},
        {category:'Mat 113', value:2, name:"mat_113"},
        {category:'GNS 112', value:3, name:"gns_112"},
        {category:'PHY 115', value:5, name:"phy_115"},
        {category:'PHY 125', value:6, name:"phy_125"},
        {category:'PHY 191', value:7, name:"phy_191"},
        {category:'CHM 111', value:8, name:"chm_111"},
        {category:'CHM 115', value:9, name:"chm_115"},
    ])
    const handleCourses = async(e) =>{
        const newCourse = e.target.value;

        navigate(`/practice/${level}/${faculty}/${newCourse}`);
        refetch()
      }
     
      const handlePage = (e) =>{
        const selectedPage = e.target.value;
        setCurrentPage(selectedPage);
        navigate(`/practice/jamb/${subject}/${e.target.value}`)
        refetch()
      }
      useEffect(() => {
        // Fetch new data based on the route parameters
        const fetchData = async () => {
          try {
            // queryClient.getQueryClient().getQueryCache().find('p_questions').query.enabled = true;
            await refetch();

        } catch (error) {
            console.error(error);
          }
        };
      
        // Call fetchData when the route parameters change
    fetchData();
    }, [course]);
    const [timer, setTimer] = useState(60)
    const [NumOfQuestions, setNumOfQuestions] = useState(60)
    const [quizCourse, setQuizCourse] = useState(course)

  return (
    <div className=' mx-auto'>
        {/* Top Bar */}
        {/* <div className="select-box p-2 grid w-[100%] lg:grid-cols-3 md:grid-cols-3 gap-2 grid-cols-1 mx-auto"> */}
        <div className="select-box p-2 grid w-[100%] lg:grid-cols-2 md:grid-cols-2 gap-2 grid-cols-1 mx-auto">
            <div className="box">
                <p className='text-md mb-2'>Select Course:</p>
                <TextField
                    className=" border-[1px] font-light border-[#e9e9e9] py-2 px-2 w-[95%] md:w-[90%] lg:w-[90%] text-md"
                    label="Select Course"
                    value={course}    
                    onChange={handleCourses}
                    select
                    >
                    {courses.map((sub)=>(
                    <MenuItem key={sub.value} value={sub.name}>
                        {sub.category}
                    </MenuItem>
                    ))}
                </TextField>
            </div>
            <div className="box">
                <p className='text-md mb-2'>Page Number:</p>
                <TextField
                    className=" border-[1px] font-light  py-2 px-2 w-[95%] md:w-[90%] lg:w-[90%] text-md"
                    label="Page Number"
                    value={1}    
                    onChange={handlePage}
                    select
                    >
                    {[0,1,2,3,4,5].map((num)=>(
                    <MenuItem key={num} value={num}>Page {num}</MenuItem>
                    ))}
                    </TextField>
            </div>
 
        </div>
        <div className="flex w-full justify-between border-b-[1px] overflow-y-scroll border-gray-300">
            <Tabs value={tabValue} className="overflow-y-scroll" onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="Practice" sx={{fontSize:10}} />
                <Tab label="Quiz" sx={{fontSize:10}} />
                <Tab label="Note" sx={{fontSize:10}} />
                <Tab label="PDF" sx={{fontSize:10}} />
            </Tabs>
        </div>
        {/*  */}
        
        {/* Tab Content */}
        {tabValue === 0 ? (
                <div className='w-full h-full md:p-3'>
                    {isLoading ? 
                     <div className="w-full items-center justify-center flex">
                        <ThreeDots 
                        height="80" 
                        width="50" 
                        radius="9"
                        color="gray" 
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                        />
                    </div>
                    :
                    (questions?.map((item, idx)=>(
                        <P_Question key={idx} question={item} idx={idx} />
                    )))
                    }
                </div>
            ) : tabValue === 1 ? (
                // Quiz Section
                <div className='w-full h-full md:p-3'>
                    <div className="flex flex-col w-full h-[250px] justify-around">
                        <TextField
                            label="Select Course"
                            value={quizCourse}    
                            onChange={(e)=>setQuizCourse(e.target.value)}
                            select>
                            {courses.map((sub)=>(
                            <MenuItem key={sub.value} value={sub.name}>
                                {sub.category}
                            </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Number of Questions"
                            value={NumOfQuestions}    
                            onChange={(e)=>setNumOfQuestions(e.target.value)}
                            select>
                            <MenuItem key="30" value="3">
                                30
                            </MenuItem>
                            <MenuItem key="4" value="4">
                                40
                            </MenuItem>
                        </TextField>
                        <TextField
                            label="Set Timer"
                            value={timer}    
                            onChange={(e)=>setTimer(e.target.value)}
                            select>
                            <MenuItem key="15" value={60}>
                                1 Minute 
                            </MenuItem>
                            <MenuItem key="20" value={60 * 5}>
                                5 Minutes
                            </MenuItem>
                            <MenuItem key="30" value={60 * 20}>
                                20 Minutes
                            </MenuItem>
                            <MenuItem key="4" value={60 * 30}>
                                30 Minutes
                            </MenuItem>
                        </TextField>
                        <button disabled={!NumOfQuestions || !quizCourse || !timer} onClick={()=>navigate(`/practice/${level}/${faculty}/${quizCourse}&limit=${NumOfQuestions}&timer=${timer}`)} className={`py-3 rounded-md w-[100%] bg-emerald-700 text-white`} >Start</button>
                    </div>
                    <div style={{display:"none"}} className={`flex flex-col p-2 items-start md:w-[80%]`}>
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