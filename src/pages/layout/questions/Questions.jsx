import { useQuery } from "react-query";
import { fetchQuestions } from "../../../api/post/post";
import Question from "./Question";
import { ThreeDots } from "react-loader-spinner";
import SideBar from "../../common/SideBar";
// import CreateQuestionForm from "./CreateQuestionForm";

function Questions() {
  const { data: questions, isLoading:questionStatus, refetch:refetchQuestion} = useQuery('questions', fetchQuestions);
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
    <div className="w-full grid grid-cols-12 gap-4 bg-[#e0e0e0] mx-auto p-2 md:p-4">
      <div className='sm:col-span-4 md:col-span-3'>
        <SideBar />
      </div>
      <div className="col-span-12 sm:col-span-8 md:col-span-6 lg:col-span-5">
        {/* CreatePostForm component for creating a new post */}
        {/* <CreateQuestionForm onCreateQuestion={handleCreateQuestion} refetchQuestion={refetchQuestion} /> */}
        <h2 className="p-2 font-light">Questions for you</h2>
        <div className="bg-gray-50">
          {questions?.map((question, idx) => (
            <Question key={idx} question={question} refetchQuestion={refetchQuestion}/>
          ))}
        </div>
      </div>


      <div className='md:col-span-3 lg:col-span-4 bg-black'></div>


    </div>
  )
}

export default Questions