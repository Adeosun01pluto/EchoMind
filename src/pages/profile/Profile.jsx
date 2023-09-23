import { Divider, Tab, Tabs } from "@mui/material"
import axios from 'axios';
import { useEffect, useState } from "react"
import { BsCalendarDate, BsFillEyeFill, BsFillPencilFill } from "react-icons/bs"
import { FaShare } from "react-icons/fa"
import { useQuery } from "react-query"
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../../constants/constant";
import { ThreeDots } from "react-loader-spinner";
import { fetchPostsById } from "../../api/post/post";
import Feed from "../layout/feeds/Feed";
import { fetchQuestionsById } from "../../api/question/question";
import Question from "../layout/questions/Question";
import { getFollowers, getFollowings } from "../../api/api";
import "../.././App.css"

function Profile() {
    const [tabValue, setTabValue] = useState(0)
    const {userId} = useParams()
    const [image, setImage] = useState(null)
    // const [isOpen, setIsOpen] = useState(null)
    // const [userData, setUserData] = useState(null)
    const [isUploading, setIsUploading] = useState(false); // Added state for upload feedback
    const handleUpload  = async() =>{
        setIsUploading(true); // Show loading feedback
        const formData = new FormData();
        formData.append('image', image);
        try {
            const response = await axios.put(`${BASE_URL}/auth/profile`, formData,  {
              headers: {
                'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
                Authorization: token,
              },
            });
            setIsUploading(false); // Hide loading feedback
            return response.data;
          } catch (error) {
            setIsUploading(false); // Hide loading feedback on error
            console.log(error.message);
          }
    }
    const token = localStorage.getItem('token');
    useEffect(()=>{
        fetchProfile()
    }, [token, userId])
    const fetchProfile = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/auth/profile/${userId}`, {
            headers: {
              Authorization: token,
            },
          });
          return response.data;
        } catch (error) {
          console.log(error.message);
        }
    };
    const { data, isLoading} = useQuery(['profile', userId], fetchProfile);
    const { data: posts, isLoading: postStatus, refetch} = useQuery(['user_posts', userId], ()=>fetchPostsById(userId));
    const { data: questions, isLoading: questionStatus,refetch:refetchQuestion} = useQuery(['user_questions',userId], ()=>fetchQuestionsById(userId));
    const { data: followings, isLoading: followingsStatus} = useQuery(['followings', userId], ()=>getFollowings(userId));
    const { data: followers, isLoading: followersStatus} = useQuery(['followers', userId], ()=>getFollowers(userId));
    if(isLoading){
        return <div className="w-full items-center justify-center flex">
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
    }
    const handleFileChange = (e) => {
        // Capture the selected file and set it in state
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };
    const openImageUpload = () => {
        document.getElementById('image-upload').click(); // Trigger click event of hidden input
    }; 
    console.log(data)
  return (
    <div>
        <div className="grid grid-cols-12 p-2 md:gap-4 w-full lg:w-[85%] min-h-[100vh] mx-auto">
            <div className="col-span-12 md:col-span-7 w-[100%]">
                {/* Profile Header */}
                <div className="w-[100%] flex items-center gap-4 min-h-32 ">
                    <div className="flex flex-col items-center">
                        <div onClick={openImageUpload} className="profileImage w-32 h-32 rounded-full bg-black">
                            {image ? (
                                <img className="rounded-full w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Selected Image" />
                            ) : (
                                <img className="rounded-full w-full h-full object-cover" src={`http://localhost:4001/images/${data.userProfile.profileImage}`} alt="" />
                            )}
                            <input type="file" accept="image/*" id="image-upload" style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                        {image && isUploading && (
                            <button className="text-sm py-1 px-2 text-white my-1 rounded-lg bg-blue-400" onClick={handleUpload}>Upload</button>
                        )}
                        {isUploading && <div>Uploading...</div>}
                    </div>
                    <div className=" md:flex-1 flex-grow">
                        <p className="text-2xl font-bold ">{data?.userProfile.username}</p>
                        <p className="text-sm text-gray-400 hover:underline cursor-pointer">Add profile credential</p>
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="md:text-sm text-xs">{data?.userProfile.followers.length} followers</span>
                            <span className="md:text-sm text-xs">{data?.userProfile.followings.length} followings</span>
                        </div>
                    </div>
                    <div className="item">
                        <FaShare />
                    </div>
                </div>
                <div className="text-sm text-gray-500 hover:underline cursor-pointer">Write a description about yourself</div>
                <div>
                    <div className="flex justify-between border-b-[1px]  border-gray-300">
                        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                            <Tab label="Posts" sx={{fontSize:12}} />
                            <Tab label="Question" sx={{fontSize:12}} />
                            <Tab label="Followings" sx={{fontSize:12}} />
                            <Tab label="Followers" sx={{fontSize:12}} />
                        </Tabs>
                    </div>
                </div>
                <div className="w-full min-h-36">
                    {tabValue === 0 ? (
                        <div className='w-full h-full md:p-3'>
                            {postStatus ? 
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
                            (posts?.map((post, idx)=>(
                                <Feed key={idx} post={post} refetch={refetch} idx={idx} />
                            )))
                            }
                        </div>
                    ) : tabValue === 1 ? (
                            <div className='w-full h-full md:p-3'>
                                {questionStatus ? 
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
                                (questions?.map((question, idx)=>(
                                    <Question key={idx} question={question} refetch={refetchQuestion} idx={idx} />
                                )))
                                }
                            </div>
                            ) : tabValue === 2 ? (
                                <div className='w-full h-full md:p-3'>
                                    {followingsStatus ? 
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
                                    (followings?.map((followings, idx)=>(
                                        <div key={idx} className="">
                                            <div className="w-[100%] items-center flex gap-2 py-2 md:gap-3 ">
                                                <Link to={`/profile/${followings.userId}`}> 
                                                    <div className='w-8 h-8 rounded-full bg-black'>
                                                        <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${followings?.profileImage}`} alt="" />
                                                    </div>
                                                </Link>
                                                <div className="flex-grow">
                                                    <p className="text-lg font-bold">{followings.username}</p>
                                                    <p className="text-sm text-gray-500">{followings.followers.length} followers</p>
                                                </div>
                                                {data?.userProfile.followings.includes(followings._id)?
                                                    <button className="py-1 px-4 flex-end text-sm border-2 border-blue-500 rounded-full text-blue-500 ">Follow</button>
                                                :
                                                    <button className="py-1 px-4 flex-end text-sm border-2 border-blue-500 rounded-full text-blue-500 ">unfollow</button>
                                                }
                                            </div>
                                            <Divider /> 

                                        </div>
                                    )))
                                    }
                                </div>
                        ) : (
                            <div className='w-full h-full md:p-3'>
                                {followersStatus ? 
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
                                (followers?.map((followers, idx)=>(
                                    <div key={idx} className="">
                                        <div className="w-[100%] items-center flex gap-2 py-2 md:gap-3 ">
                                            <Link to={`/profile/${followers.userId}`}> 
                                                <div className='w-8 h-8 rounded-full bg-black'>
                                                    <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${followers?.profileImage}`} alt="" />
                                                </div>
                                            </Link>
                                            <div className="flex-grow">
                                                <p className="text-lg font-bold">{followers.username}</p>
                                                <p className="text-sm text-gray-500">{followers.followers.length} followers</p>
                                            </div>
                                            {followers._id === userId ?
                                                <button className="py-1 px-4 flex-end text-sm border-2 border-blue-500 rounded-full text-blue-500 ">Follow</button>
                                            :
                                                <button className="py-1 px-4 flex-end text-sm border-2 border-blue-500 rounded-full text-blue-500 ">unfollow</button>
                                            }
                                        </div>
                                        <Divider /> 

                                    </div>
                                )))
                                }
                            </div>
                    ) 
                }
                </div>
            </div>
            <div className="col-span-0 profile_right md:col-span-5 dark:bg-[#171517] bg-[#f2e4fb] p-2">
                <div>
                    <div className="flex py-2 justify-between border-b-2 border-gray-200 items-center w-full">
                        <span className="mb-2 font-light">Credential & Highlights</span>
                        <span><BsFillPencilFill /></span>
                    </div>
                    <div className="flex items-center">
                        <BsFillEyeFill />
                        <span>2.7M content Posts </span>
                    </div>
                    <div className="flex items-center">
                        <BsCalendarDate/>
                        <span>Joined May 2018 </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile