// Posts.js
import { useMutation, useQuery } from 'react-query';

import axios from 'axios';
// import { useState } from 'react';
import CreatePostForm from './CreatePostForm';
import Feed from './Feed';
import { ThreeDots } from 'react-loader-spinner';
import { BASE_URL } from '../../../constants/constant';
import { fetchPosts} from '../../../api/post/post';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../common/SideBar';
import { fetchQuestions } from '../../../api/question/question';

const Feeds = () => {
  const navigate = useNavigate()
  const { refetch:refetchQuestion} = useQuery('questions', fetchQuestions, {
    onLoad: true, 
  });
  const { data: posts, isLoading, refetch, isError} = useQuery('posts', fetchPosts, {
    onLoad: true, 
  });
  const createQuestionMutation = useMutation((newQuestion) =>
  axios.post(`${BASE_URL}/question/add_question`, newQuestion, {
    headers: {
      "Authorization": localStorage.getItem('token'),
    },
  })
  );
  const handleCreateQuestion = async (newQuestion) => {
    try {
      await createQuestionMutation.mutateAsync(newQuestion);
      refetchQuestion()
      navigate("/questions")
    } catch (error) {
      console.error(error);
    }
  };
  const createPostMutation = useMutation((newPost) =>
    axios.post(`${BASE_URL}/create_post`, newPost, {
      headers: {
        "Authorization": localStorage.getItem('token'),
      },
    })
  );

  const handleCreatePost = async (newPost) => {
    try {
      // Use the createPostMutation to create a new post
      await createPostMutation.mutateAsync(newPost);
      // Refetch the list of posts after creating a new one
      refetch()
    } catch (error) {
      console.error(error);
    }
  };
  if (isLoading) {
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
  if (isError) {
    return (
      <div className="w-full items-center justify-center flex">
        An Error Occurred
      </div>
    )
  }
  return (
    <div className="w-full grid dark:text-[#f2e4fb] text-[#060109] grid-cols-12 gap-2 md:gap-4  mx-auto p-2 md:p-4">
      <div className='sm:col-span-3 md:col-span-2'>
        <SideBar />
      </div>
      <div className='col-span-12 sm:col-span-9 md:col-span-7 lg:col-span-6 '>
        {/* CreatePostForm component for creating a new post */}
        <CreatePostForm onCreatePost={handleCreatePost} onCreateQuestion={handleCreateQuestion} refetch={refetch} />
        {posts?.map((post, idx) => (
          <Feed key={idx} post={post} refetch={refetch}/>
        ))}
      </div>
      <div className='md:col-span-3 lg:col-span-4 bg-black'></div>
    </div>
  );
};

export default Feeds;
