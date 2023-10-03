import { useMutation, useQuery } from "react-query";
import Question from "./Question";
import { ThreeDots } from "react-loader-spinner";
import SideBar from "../../common/SideBar";
import { fetchQuestions } from "../../../api/question/question";
// import CreateQuestionForm from "./CreateQuestionForm";
import "../../../App.css"
import RightBar from "../../common/RightBar";
import { Link } from "react-router-dom";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AiOutlineSend } from 'react-icons/ai';
import { BASE_URL } from "../../../constants/constant";
import axios from "axios";



function Questions() {
  const [value, setValue] = useState('');
  const [showButton, setShowButton] = useState(false);

  const handleEditorChange = (content) => {
    setValue(content);
    setShowButton(!!content); // Show the button if content is not empty
  };
  
  const { data: questions, isLoading:questionStatus, refetch:refetchQuestion, error, isError} = useQuery(['questions'], fetchQuestions, 
  {
    onLoad : true
  },
  );
  const createQuestionMutation = useMutation((newQuestion) =>
  axios.post(`${BASE_URL}/question/add_question`, newQuestion, {
    headers: {
      "Authorization": localStorage.getItem('token'),
    },
  })
  );

  const handleCreateQuestion = async(e) => {
    e.preventDefault();
    // Create a new post object with the title and content
    const newQuestion = { question:value };
    // Call the onCreatePost function passed from the parent component
    try {
      await createQuestionMutation.mutateAsync(newQuestion);
      refetchQuestion()
    } catch (error) {
      console.error(error);
    }
    // Clear the form inputs
    refetchQuestion()
    setValue('');
    setShowButton(false);
  };

  if(error?.message){
    return (
      <div className="w-full items-center justify-center flex">
        <Link to="/login" >Unauthorized Login</Link>
      </div>
    )
  }
  if (isError) {
    return (
      <div className="w-full items-center justify-center flex">
        An Error Occurred
      </div>
    )
  }
  if (questionStatus) {
    return (
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
    )
  }
  

  return (
    <div className="w-full dark:text-[#f2e4fb] text-[#060109] gap-2 md:gap-4  mx-auto p-2 md:p-4 flex flex-col md:flex-row">
      {/* <SideBar /> */}
      <div className="md:w-2/12 fixed hidden md:block"> {/* Sidebar */}
        <SideBar />
      </div>
      <div className="main_bar md:w-6/12 w-full">
        <div className='relative mb-2'>
            <ReactQuill theme="snow" style={{border:"2px solid gray", background:"white", color:"black"}} placeholder='What do you wanna ask?' value={value} onChange={handleEditorChange} />
            {showButton && (
              <button onClick={handleCreateQuestion} className='absolute right-0 bottom-[0px] font-bold'><AiOutlineSend size={20} color='#4f1179' /></button>
            )}
        </div>
        {/* CreatePostForm component for creating a new post */}
        {/* <CreateQuestionForm onCreateQuestion={handleCreateQuestion} refetchQuestion={refetchQuestion} /> */}
        <h2 className="p-2 font-light bg-red-500">Questions for you</h2>
        <div className="">
          {questions?.map((question, idx) => (
            <Question key={idx} question={question} refetchQuestion={refetchQuestion}/>
          ))}
        </div>
      </div>


      <div className="md:w-4/12 hidden md:block"> {/* Right Sidebar */}
        <RightBar />
      </div>
      {/* <RightBar /> */}


    </div>
  )
}

export default Questions