// Posts.js
import { useMutation, useQuery } from 'react-query';

import axios from 'axios';
// import { useState } from 'react';
import CreatePostForm from './CreatePostForm';
import Feed from './Feed';
import { ThreeDots } from 'react-loader-spinner';
import { BASE_URL } from '../../../constants/constant';
import { fetchPosts} from '../../../api/post/post';
import { Link, useNavigate } from 'react-router-dom';
import SideBar from '../../common/SideBar';
import { fetchQuestions } from '../../../api/question/question';
import RightBar from '../../common/RightBar';
import { getUserId } from '../../../api/api';

const Feeds = () => {
  const token = localStorage.getItem('token');
  const userId = getUserId();

  const navigate = useNavigate()
  const { refetch:refetchQuestion} = useQuery('questions', fetchQuestions, {
    onLoad: true,
    enabled: Boolean(token && userId), // Enable the query only if both token and userId are available
  });
  const { data: posts, isLoading, refetch, isError, error} = useQuery('posts', fetchPosts, {
    onLoad : true,
    enabled: Boolean(token && userId), // Enable the query only if both token and userId are available
  }
  );
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
      console.log(newPost)
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
  if(!error?.message && !token ){
    window.location.reload();
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
  return (
    <div className="w-full dark:text-[#f2e4fb] text-[#060109] gap-2 md:gap-4  mx-auto p-2 md:p-4 flex flex-col md:flex-row">
      {/* <SideBar /> */}
      <div className="md:w-2/12 fixed hidden md:block"> {/* Sidebar */}
        <SideBar />
      </div>
      <div className='main_bar md:w-5/12 w-full'>
        {/* CreatePostForm component for creating a new post */}
        <CreatePostForm onCreatePost={handleCreatePost} onCreateQuestion={handleCreateQuestion} refetch={refetch} />
        {posts?.map((post, idx) => (
          <Feed key={idx} post={post} refetch={refetch}/>
        ))}
      </div>
      <div className="md:w-4/12 hidden md:block"> {/* Right Sidebar */}
        <RightBar />
      </div>
      {/* <RightBar /> */}
    </div>
  );
};

export default Feeds;
