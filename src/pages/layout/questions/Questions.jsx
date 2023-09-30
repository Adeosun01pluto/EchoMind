import { useQuery } from "react-query";
import Question from "./Question";
import { ThreeDots } from "react-loader-spinner";
import SideBar from "../../common/SideBar";
import { fetchQuestions } from "../../../api/question/question";
// import CreateQuestionForm from "./CreateQuestionForm";
import "../../../App.css"
import RightBar from "../../common/RightBar";
function Questions() {
  const { data: questions, isLoading:questionStatus, refetch:refetchQuestion} = useQuery(['questions'], fetchQuestions, 
  {
    onLoad : true
  },
  );

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
        {/* CreatePostForm component for creating a new post */}
        {/* <CreateQuestionForm onCreateQuestion={handleCreateQuestion} refetchQuestion={refetchQuestion} /> */}
        <h2 className="p-2 font-light">Questions for you</h2>
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