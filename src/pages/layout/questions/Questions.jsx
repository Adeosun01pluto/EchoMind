import { useQuery } from "react-query";
import { fetchQuestions } from "../../../api/post/post";
import Question from "./Question";
import { ThreeDots } from "react-loader-spinner";
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
    <div className="container md:w-[50%] rounded-sm md:p-4 p-2 border-2 mx-auto">
      {/* CreatePostForm component for creating a new post */}
      {/* <CreateQuestionForm onCreateQuestion={handleCreateQuestion} refetchQuestion={refetchQuestion} /> */}
      <h2 className="p-2 font-light">Questions for you</h2>
      <div className="bg-gray-50">
        {questions?.map((question, idx) => (
          <Question key={idx} question={question} refetchQuestion={refetchQuestion}/>
        ))}
      </div>
    </div>
  )
}

export default Questions