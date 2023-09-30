import { Button, Dialog, DialogContent} from '@mui/material'
import TextareaAutosize from 'react-textarea-autosize';
import {  useState } from 'react';
import { BsFillArrowDownSquareFill} from 'react-icons/bs'
import { RiQuestionAnswerLine } from 'react-icons/ri'
import { useMutation, useQuery } from 'react-query';
import { BASE_URL } from '../../../constants/constant';
import axios from 'axios';
import { downVote, fetchAnswers } from '../../../api/question/question';
import { ThreeDots } from 'react-loader-spinner';
import Answer from './Answer';
import { getUserId } from '../../../api/api';

function Question({refetchQuestion, question}) {
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
  axios.post(`${BASE_URL}/question/add_answer/${question._id}`, {answer}, {
    headers: {
      "Authorization": localStorage.getItem('token'),
    },
  })
  );
  const { data: answers, isLoading: statusAnswer, refetch:refetchAnswers} = useQuery(['answers', question._id], ()=>fetchAnswers(question._id));
  // fetchAnswers
  const handleAddAnswer = async () => {
    try {
      // Use the createAnswerMutation to create a new post
      await createAnswerMutation.mutateAsync();
      // Refetch the list of posts after creating a new one
      setOpen(false);
      refetchAnswers()
      refetchQuestion()
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnlike = async (questionId) => {
    try {
      await downVote(questionId, refetchQuestion);

    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className=" my-1 rounded-md dark:bg-[#171517] bg-[#f2e4fb] pt-2 md:pt-3">
      {/*  */}
      <div className="font-semibold px-2 hover:underline cursor-pointer sm:text-lg">{question?.question}</div>
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
      <div className="px-2">
        <span onClick={handleClickOpenAnswer} className="hover:underline font-semibold text-gray-500 text-sm cursor-pointer">{answers?.length} answers</span>
      </div>
      }
      {/*  */}
      <div className='flex items-center px-2 py-1 gap-2 text-black'>
        <div onClick={handleClickOpen} className='bg-white cursor-pointer flex items-center gap-2 py-1 px-2  border-2 rounded-full'>
          <RiQuestionAnswerLine />
          <span className='text-sm'>Answer</span>
        </div>

        {/* Post Actions */}
        <div className="flex items-center gap-2 border-2 bg-white rounded-full">
          {/* Render like/unlike button based on liked status */}
          <div className="flex items-center border-2 rounded-full">
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
      </div>

      {/* Answers */}
      {!openAnswer? null :
        (<div className='w-[99%] mx-1 pt-1 rounded-t-md min-h-12 mt-2 dark:bg-[#060109] bg-[#f2e4fb]'>
          <p className='px-2 pt-1 text-gray-600 font-semibold underline'>Answers</p>
          <div className='sm:rounded-sm'>
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
              (answers?.length === 0 ? 
                <span className='px-2'> No answer yet</span>
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" sx={{color:"#060109", minHeight:400}} fullWidth={true}>
        <div className='w-full flex'>
          <button onClick={handleClose} className='px-2 py-1 font-bold'>X</button>
        </div>
        <DialogContent sx={{height:400}}>
            <div className='w-full h-full flex flex-col'>
              <div className="mb-4 flex flex-col h-[90%]">
                <label htmlFor="question" className="block font-bold text-gray-600 text-lg md:text-xl">
                  {question?.question}
                </label>
                <TextareaAutosize 
                    required
                    id="question"
                    className="w-full p-2 flex-1 outline-none border-b-2 border-gray-300"
                    placeholder="Write your answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    cacheMeasurements={true}
                    autoFocus
                    style={{ resize: 'none' }} // Add this line to hide the resize handle
                />

              </div>
              <Button variant="contained" onClick={handleAddAnswer} color="primary" sx={{
                background:"#4f1179",
                  "&:hover": {
                    backgroundColor: "#4f1179 !important",
                    boxShadow: "none !important",
                  },
                  "&:active": {
                    boxShadow: "none !important",
                    backgroundColor: "#4f1179 !important",
                  },
                }}>
                Answer
              </Button>
              {/* <Button onClick={handleClose}>X</Button> */}
            </div>
          
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Question