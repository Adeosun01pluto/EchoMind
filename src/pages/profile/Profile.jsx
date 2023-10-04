import { Dialog, Divider, Tab, Tabs } from "@mui/material"
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { useEffect, useState } from "react"
import { BsCalendarDate, BsFillEyeFill, BsFillPencilFill } from "react-icons/bs"
import { BiSolidMessageDots } from "react-icons/bi"
import { useQuery } from "react-query"
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../../constants/constant";
import { ThreeDots } from "react-loader-spinner";
import { fetchPostsById } from "../../api/post/post";
import Feed from "../layout/feeds/Feed";
import { fetchQuestionsById } from "../../api/question/question";
import Question from "../layout/questions/Question";
import { follow, getFollowers, getFollowings, getUserId, unfollow} from "../../api/api";
import "../.././App.css"

function Profile() {
    const [tabValue, setTabValue] = useState(0);
    const {userId} = useParams()
    const [loggedData, setLoggedData ] = useState(null)
    const loggedInUserId = getUserId()
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
    const { data, isLoading, refetch:refetchProfile} = useQuery(['profile', userId], fetchProfile);
    const { data: posts, isLoading: postStatus, refetch} = useQuery(['user_posts', userId], ()=>fetchPostsById(userId), 
    {
        onLoad: true
    }
    );
    const { data: questions, isLoading: questionStatus,refetch:refetchQuestion} = useQuery(['user_questions',userId], ()=>fetchQuestionsById(userId));
    const { data: followings, isLoading: followingsStatus} = useQuery(['followings', userId], ()=>getFollowings(userId));
    const { data: followers, isLoading: followersStatus} = useQuery(['followers', userId], ()=>getFollowers(userId));
    const fetchLoggedUserProfile = async() =>{
        try {
            const response = await axios.get(`${BASE_URL}/auth/profile/${loggedInUserId}`, {
              headers: {
                Authorization: token,
              },
            });
            setLoggedData(response?.data.userProfile)
        } catch (error) {
            console.log(error.message);
        }
    }
    const [image, setImage] = useState(null)
    const [coverPhoto, setCoverPhoto] = useState(null)
    const [openSetting, setOpenSetting] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false); // Added state for upload feedback
    const token = localStorage.getItem('token');
    useEffect(()=>{
        fetchLoggedUserProfile()
    }, [loggedInUserId])
    useEffect(()=>{
        fetchProfile()
        setTabValue(0)
    }, [userId])
          
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [fullname, setFullname] = useState('');
    const [showFullBio, setShowFullBio] = useState(false);

    useEffect(() => {
        // Check if loggedData is available and has a username
        if (loggedData?.username) {
          setUsername(loggedData.username);
        }
        if (loggedData?.fullname) {
          setFullname(loggedData.fullname);
        }
        if (loggedData?.bio) {
          setBio(loggedData.bio);
        }
        if (loggedData?.location) {
          setLocation(loggedData.location);
        }
    }, [loggedData]);
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
    const handleFileChangeCover = (e) => {
        // Capture the selected file and set it in state
        const selectedImage = e.target.files[0];
        setCoverPhoto(selectedImage);
    };
    const openImageUpload = () => {
        document.getElementById('image-upload').click(); // Trigger click event of hidden input
    }; 
    const openImageUploadCover = () => {
        document.getElementById('image-upload-cover').click(); // Trigger click event of hidden input
    }; 
    const handleSaveProfile = async ()=>{
        setIsUploaded(true); // Hide loading feedback
        const formData = new FormData();
        if (image) {
            // Append the image with a key or identifier (e.g., 'profileImage')
            formData.append('profileImage', image);
          }
          
        if (coverPhoto) {
            // Append the coverPhoto with a key or identifier (e.g., 'coverPhoto')
            formData.append('coverPhoto', coverPhoto);
        }
        formData.append('location', location);
        formData.append('username', username);
        formData.append('bio', bio);
        formData.append('fullname',fullname );
        try {
            const response = await axios.put(`${BASE_URL}/auth/profile`, formData,  {
              headers: {
                'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
                Authorization: token,
              },
            });
            setOpenSetting(false)
            setFullname("")
            setBio("")
            setLocation("")
            setImage(null)
            setCoverPhoto(null)
            setIsUploaded(false); // Hide loading feedback
            refetchProfile()
            return response.data;
          } catch (error) {
            setIsUploaded(false); // Hide loading feedback on error
            console.log(error.message);
        }
    }
    const  openSettingHandler = () =>{
        setOpenSetting(true)
    }
    const handleCloseSetting = () => {
        setOpenSetting(false);
    };
    const handleFollow = async () => {
        try {
            await follow(userId , refetchProfile);
            console.log("follow clicked")
          // Update the liked status for the post
        } catch (error) {
          console.error(error);
        }
    };
    const handleUnFollow = async () => {
        try {
              await unfollow(userId, refetchProfile);
            console.log("unfollow clicked")
          // Update the liked status for the post
        } catch (error) {
          console.error(error);
        }
    };

    const toggleBio = () => {
        setShowFullBio(!showFullBio);
    };

    const bioText = data?.userProfile.bio || '';
    const truncatedBio = showFullBio ? bioText : bioText.split(' ').slice(0, 30).join(' ');

    return (
    <div>
        <div className="md:gap-4 flex w-full justify-between bg-white md:w-[85%] min-h-[100vh] mx-auto">
            <div className="w-full md:w-7/12">
                {/* Profile Header */}
                <div className="w-[100%] flex flex-col gap-4 min-h-32 rounded-md ">
                    {/* Cover Image */}
                    <div className="w-full h-[250px] relative">
                        <div className="w-full h-full">
                            {coverPhoto ? (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={URL.createObjectURL(coverPhoto)}
                                            alt="Selected Image"
                                        />
                                        ) : data?.userProfile?.profileImage ? (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={`${BASE_URL}/images/${data?.userProfile.profileImage}`}
                                            alt=""
                                        />) : (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={data?.userProfile.avatarData}
                                            alt=""
                                        />)
                                }
                        </div>
                        {/*  */}
                        <div className="flex flex-col items-center left-[15px] md:bottom-[-50px] bottom-[-30px] absolute">
                            <div className="profileImage md:w-[110px] md:h-[110px] w-16 h-16 rounded-full">
                                {data?.userProfile?.profileImage ? (
                                        <img
                                            className="rounded-full w-full h-full object-cover"
                                            src={`${BASE_URL}/images/${data?.userProfile.profileImage}`}
                                            alt=""
                                        />) : (
                                        <img
                                            className="rounded-full w-full h-full object-cover"
                                            src={data?.userProfile.avatarData}
                                            alt=""
                                        />)
                                }
                            </div>
                        </div>
                        <div className="item absolute bottom-[-40px] right-2 flex items-center gap-2">
                            {/* <FaShare /> */}
                            <BiSolidMessageDots size={25} color="#4f1179" />
                            {
                                loggedInUserId === userId ? null :
                                (data?.userProfile.followers.includes(loggedInUserId) ?
                                <button onClick={handleUnFollow} className="px-2 py-2 font-bold text-[#4f1179] text-xs bg-white  rounded-full">unfollow</button> :
                                <button onClick={handleFollow} className="px-2 py-2 font-bold bg-[#4f1179] text-xs text-white rounded-full">Follow</button> 
                                )
                            }
                        </div>
                    </div>
                    {/*  */}
                    <div className="mt-[30px] px-6">
                        <div className=" md:flex-1 flex-grow">
                            <p className="text-xl font-bold ">{data?.userProfile.fullname}</p>
                            <p className="text-sm text-gray-500">@{data?.userProfile.username}</p>
                            <div className="py-2">
                                {data?.userProfile.bio?
                                    <p className={`text-sm font-light ${showFullBio ? '' : 'bio-text'}`}>
                                        {truncatedBio}
                                        {!showFullBio && '... '}
                                        {!showFullBio && (
                                            <span className="cursor-pointer bio-expand underline text-blue-600" onClick={toggleBio}>
                                            Read More
                                        </span>
                                        )}
                                    </p> : ""
                                }
                            </div>
                            {userId === loggedInUserId ? 
                            <p onClick={()=>openSettingHandler()} className="text-sm text-gray-400 hover:underline cursor-pointer">Add profile credential</p> : null
                            }
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="md:text-sm text-gray-500 text-xs"><span className="text-black font-bold">{data?.userProfile.followings.length} </span>followings</div>
                                <div className="md:text-sm text-gray-500 text-xs"><span className="text-black font-bold">{data?.userProfile.followers.length} </span>followers</div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                {/* <div className="text-sm text-gray-500 hover:underline cursor-pointer">Write a description about yourself</div> */}

                {/* Tabs */}
                <div>
                    <div className="flex justify-between border-b-[1px]  border-gray-300">
                        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{
                        "& .MuiTabs-indicator": {
                            backgroundColor: "#4f1179 !important",
                        },
                        }}>
                            <Tab label="Posts" sx={{
                                color: tabValue === 0 ? "#4f1179 !important" : "inherit",
                                "&.Mui-selected": {
                                color: "#4f1179 !important",
                                },
                            }} />
                            <Tab label="Question" sx={{
                                color: tabValue === 0 ? "#4f1179 !important" : "inherit",
                                "&.Mui-selected": {
                                color: "#4f1179 !important",
                                },
                            }} />
                            <Tab label="Followings" sx={{
                                color: tabValue === 0 ? "#4f1179 !important" : "inherit",
                                "&.Mui-selected": {
                                color: "#4f1179 !important",
                                },
                            }} />
                            <Tab label="Followers" sx={{
                                color: tabValue === 0 ? "#4f1179 !important" : "inherit",
                                "&.Mui-selected": {
                                color: "#4f1179 !important",
                                },
                            }} />
                        </Tabs>
                    </div>
                </div>

                {/* Tab content */}
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
                            (posts?.posts?.map((post, idx)=>(
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
                                                <Link to={`/profile/${followings._id}`}> 
                                                    <div className='w-8 h-8 rounded-full border-none outline-none bg-black'>
                                                        {followings?.profileImage ? 
                                                        <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${followings?.profileImage}`} alt="" />
                                                        :
                                                        <img className="rounded-full w-full h-full object-cover" src={followings?.avatarData} alt />
                                                        }
                                                    </div>
                                                </Link>
                                                <div className="flex-grow">
                                                    <p className="text-lg font-bold">{followings.username}</p>
                                                    <p className="text-sm text-gray-500">{followings.followers.length} followers</p>
                                                </div>
                                                {/* {data?.userProfile.followings.includes(followings._id)?
                                                    <button className="py-1 px-4 flex-end text-sm border-2 border-blue-500 rounded-full text-blue-500 ">Follow</button>
                                                :
                                                    <button className="py-1 px-4 flex-end text-sm border-2 border-blue-500 rounded-full text-blue-500 ">unfollow</button>
                                                } */}
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
                                            <Link to={`/profile/${followers._id}`}> 
                                                <div className='w-8 h-8 rounded-full '>
                                                    {followers?.profileImage ? 
                                                        <img className="rounded-full w-full h-full object-cover" src={`${BASE_URL}/images/${followers?.profileImage}`} alt="" />
                                                        :
                                                        <img className="rounded-full w-full h-full object-cover" src={followers?.avatarData} alt />
                                                    }
                                                </div>
                                            </Link>
                                            <div className="flex-grow">
                                                <p className="text-lg font-bold">{followers.username}</p>
                                                <p className="text-sm text-gray-500">{followers.followers.length} followers</p>
                                            </div>
                                            {/* {followers._id === userId ?
                                                <button className="py-1 px-4 flex-end text-sm border-2 border-blue-500 rounded-full text-blue-500 ">Follow</button>
                                            :
                                                <button className="py-1 px-4 flex-end text-sm border-2 border-blue-500 rounded-full text-blue-500 ">unfollow</button>
                                            } */}
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
            <div className="md:w-4/12 md:flex hidden dark:bg-[#171517] bg-[#f2e4fb] p-2">
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
        {/* Setting */}
        <Dialog open={openSetting} onClose={handleCloseSetting} sx={{minHeight:500}} fullWidth={true} maxWidth="sm" className="">
                <div>
                    <div className='flex justify-between items-center px-4 py-2'>
                        <p className='px-3 p-2 text-lg text-[#4f1179]'>Orbit Setting</p>
                        {isUploaded ?
                            <ThreeDots 
                            height="30" 
                            width="30" 
                            radius="9"
                            color="#4f1179" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                            /> :    
                            <button onClick={handleSaveProfile} className='px-2 font-semibold bg-[#4f1179] text-white text-sm rounded-full'>Save</button>
                        }
                    </div>
                    <div className="w-full mb-24 h-48 bg-blue-500 relative">
                        <div onClick={openImageUploadCover} className="w-full h-full">
                            {coverPhoto ? (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={URL.createObjectURL(coverPhoto)}
                                            alt="Selected Image"
                                        />
                                        ) : data?.userProfile?.profileImage ? (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={`${BASE_URL}/images/${data?.userProfile.profileImage}`}
                                            alt=""
                                        />) : (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={data?.userProfile.avatarData}
                                            alt=""
                                        />)
                                }
                            {userId === loggedInUserId ? 
                                    <input type="file" accept="image/*" id="image-upload-cover" style={{ display: 'none' }} onChange={handleFileChangeCover} />
                                    : null
                            }
                        </div>
                        {/*  */}
                        <div className="flex flex-col items-center left-[15px] md:bottom-[-50px] bottom-[-50px] absolute">
                            <div onClick={openImageUpload} className="bg-red-500 profileImage md:w-[110px] md:h-[110px] w-32 h-32 rounded-full">
                                {image ? (
                                        <img
                                            className="rounded-full w-full h-full object-cover"
                                            src={URL.createObjectURL(image)}
                                            alt="Selected Image"
                                        />
                                        ) : data?.userProfile?.profileImage ? (
                                        <img
                                            className="rounded-full w-full h-full object-cover"
                                            src={`${BASE_URL}/images/${data?.userProfile.profileImage}`}
                                            alt=""
                                        />) : (
                                        <img
                                            className="rounded-full w-full h-full object-cover"
                                            src={data?.userProfile.avatarData}
                                            alt=""
                                        />)
                                }
                                {userId === loggedInUserId ? 
                                    <input type="file" accept="image/*" id="image-upload" style={{ display: 'none' }} onChange={handleFileChange} />
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full gap-2 flex'>
                    <div className='w-[95%] mx-auto flex flex-col gap-3'>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-lg">Full Name</label>
                            <input type="text" value={fullname} onChange={(e)=>setFullname(e.target.value)} className="p-2 border-[1px] rounded-sm outline-gray-100 border-gray-100" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-lg">Username</label>
                            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} className="p-2 border-[1px] rounded-sm outline-gray-100 border-gray-100" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-lg">Bio</label>
                            {/* <textarea type="text" value={bio} onChange={(e)=>setBio(e.target.value)} className="p-2 border-[1px] rounded-sm outline-gray-100 border-gray-100"></textarea> */}
                            <TextareaAutosize 
                                required
                                id="bio"
                                placeholder="Type your Bio here"
                                value={bio} onChange={(e)=>setBio(e.target.value)} className="p-2 border-[1px] rounded-sm outline-gray-100 border-gray-100"
                                cacheMeasurements={true}
                                autoFocus
                                style={{ resize: 'none' }} // Add this line to hide the resize handle
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-lg">Location</label>
                            <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)} className="p-2 border-[1px] rounded-sm outline-gray-100 border-gray-100"/>
                        </div>
                        <div className="flex flex-col gap-3">
                        </div>
                    </div>
                </div>
        </Dialog>
    </div>
  )
}

export default Profile