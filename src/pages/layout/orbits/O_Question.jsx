import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import {  useState } from 'react';
import { BsFillArrowDownSquareFill } from 'react-icons/bs'
import { RiQuestionAnswerLine } from 'react-icons/ri'
import { useMutation, useQuery } from 'react-query';
import { BASE_URL } from '../../../constants/constant';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import Answer from '../questions/Answer';
import { downVoteQuestion, fetchO_Answers } from '../../../api/orbit/orbit';
import { getUserId } from '../../../api/api';

function O_Question({refetchQuestion, question, orbitId}) {
  const userId = getUserId()
  const [open, setOpen] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);
  const [answer, setAnswer] = useState('');
  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClickOpenAnswer = () => {
    setOpenAnswer(!openAnswer);
  }
  const handleClose = () => {
    setOpen(false);
  };
  const createAnswerMutation = useMutation(() =>
  axios.post(`${BASE_URL}/orbit/add_answer/${orbitId}/${question._id}`, {answer}, {
    headers: {
      "Authorization": localStorage.getItem('token'),
    },
  })
  );
  const { data: answers, isLoading: statusAnswer, refetch:refetchAnswers} = useQuery(['o_answers', question._id], ()=>fetchO_Answers(question._id));
  const handleAddAnswer = async () => {
    try {
      // Use the createAnswerMutation to create a new post
      await createAnswerMutation.mutateAsync();
      // Refetch the list of posts after creating a new one
      setAnswer("")
      setOpen(false);
      refetchAnswers()
      refetchQuestion()
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnlike = async (questionId) => {
    try {
      await downVoteQuestion(questionId, refetchQuestion);

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className=" my-1 rounded-md dark:bg-[#171517] bg-[#f2e4fb] pt-2 md:pt-3">
      {/*  */}
      <div className="font-semibold px-2  hover:underline cursor-pointer sm:text-lg">{question?.question}</div>
      {/*  */}
      {statusAnswer? 
      <ThreeDots 
      height="20" 
      width="20" 
      radius="9"
      color="gray" 
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClassName=""
      visible={true}
      />
      : 
      <div className="py-1 px-2">
        <span onClick={handleClickOpenAnswer} className="hover:underline font-semibold text-gray-500 text-sm cursor-pointer">{answers?.length} answers</span>
      </div>
      }
      {/*  */}
      <div className='flex items-center px-2 py-1 gap-2 '>
        <div onClick={handleClickOpen} className='cursor-pointer flex items-center gap-2 py-1 px-2  border-2 rounded-full'>
          <RiQuestionAnswerLine />
          <span className='text-sm'>Answer</span>
        </div>
        <div className='flex items-center gap-2 border-2 rounded-full'>
          <button
              onClick={() => handleUnlike(question?._id)}
              className="p-1 px-2 rounded flex items-center gap-2 "
            >
              <span>Downvote</span>
              {question?.downvotes.includes(userId)?
                <BsFillArrowDownSquareFill size={13} color="#4f1179" /> :
                <BsFillArrowDownSquareFill size={13} color="gray" /> 
              }
              <span className='text-xs md:text-sm'>{question?.downvotes.length}</span>
            </button>
        </div>
      </div>

      {/* ANswers */}
      {!openAnswer? null :
        (<div className='w-[99%] mx-1 pt-1 rounded-t-md min-h-12 mt-2 dark:bg-[#060109] bg-[#f2e4fb]'>
          <p className='p-2 text-gray-600 font-semibold underline'>Answers</p>
          <div className='sm:rounded-sm my-2'>
            {statusAnswer? 
              <ThreeDots 
              height="20" 
              width="20" 
              radius="9"
              color="gray" 
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
              />
              : (answers.length === 0?  
                    <div>No Answer Yet</div>    
                    :
                    (answers?.map((answer, idx) =>(
                        <Answer answer={answer} key={idx}/>
                        ))
                    ) 
              )
            }
          </div>
        </div>)
        }




      {/*  */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth={true}>
        <DialogTitle>
          <Button onClick={handleClose}>X</Button>
        </DialogTitle>
        <DialogContent sx={{height:400}}>
            <form className='w-full h-full'>
              <div className="mb-4 flex flex-col h-[90%]">
                <label htmlFor="question" className="block font-bold text-gray-600 text-2xl">
                  The main question
                </label>
                <textarea
                  id="question"
                  className="w-full p-2 flex-1 outline-none border-b-2 border-gray-300"
                  placeholder="Write your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                />
              </div>
              <Button variant="contained" onClick={handleAddAnswer} color="primary">
                Post
              </Button>
              {/* <Button onClick={handleClose}>X</Button> */}
            </form>
          
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default O_Question