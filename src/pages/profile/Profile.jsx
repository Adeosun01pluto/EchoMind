import { Tab, Tabs } from "@mui/material"
import axios from 'axios';
import { useEffect, useState } from "react"
import { BsCalendarDate, BsFillEyeFill, BsFillPencilFill } from "react-icons/bs"
import { FaShare } from "react-icons/fa"
import { useQuery } from "react-query"

function Profile() {
    const [tabValue, setTabValue] = useState(0)
    const [image, setImage] = useState(null)
    const [isUploading, setIsUploading] = useState(false); // Added state for upload feedback
    const handleUpload  = async() =>{
        setIsUploading(true); // Show loading feedback
        const formData = new FormData();
        formData.append('image', image);
        try {
            const response = await axios.put('http://localhost:4001/auth/profile', formData,  {
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
    }, [token])
    const fetchProfile = async () => {
        try {
          const response = await axios.get('http://localhost:4001/auth/profile', {
            headers: {
              Authorization: token,
            },
          });
          return response.data;
        } catch (error) {
          console.log(error.message);
        }
    };
    const { data, isLoading} = useQuery('profile', fetchProfile);
    if(isLoading){
        return " Loading"
    }
    const handleFileChange = (e) => {
        // Capture the selected file and set it in state
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };
    const openImageUpload = () => {
        document.getElementById('image-upload').click(); // Trigger click event of hidden input
    }; 
  return (
    <div>
        <div className="grid grid-cols-12 p-2 md:gap-12 w-[80%] h-[100vh] mx-auto">
            <div className="col-span-8">
                {/* Profile Header */}
                <div className="w-full flex items-center gap-4 min-h-32 ">
                    <div className="flex flex-col items-center">
                        <div onClick={openImageUpload} className="profileImage w-32 h-32 rounded-full bg-black">
                            {/* <img className="rounded-full w-full h-full object-cover" src={`http://localhost:4001/images/${image || data.userProfile.profileImage}`} alt="" /> */}
                            {image ? (
                                <img className="rounded-full w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Selected Image" />
                            ) : (
                                <img className="rounded-full w-full h-full object-cover" src={`http://localhost:4001/images/${data.userProfile.profileImage}`} alt="" />
                            )}
                            <input type="file" accept="image/*" id="image-upload" style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                        {image && !isUploading && (
                            <button className="text-sm py-1 px-2 text-white my-1 rounded-lg bg-blue-400" onClick={handleUpload}>Upload</button>
                        )}
                        {isUploading && <div>Uploading...</div>}
                    </div>
                    <div className=" md:flex-1">
                        <p className="text-2xl font-bold ">{data?.userProfile.username}</p>
                        <p className="text-sm text-gray-400 hover:underline cursor-pointer">Add profile credential</p>
                        <div className="flex items-center gap-2 md:gap-3">
                            <span>{data?.userProfile.followers.length} followers</span>
                            <span>{data?.userProfile.followings.length} followings</span>
                        </div>
                    </div>
                    <div className="item">
                        <FaShare />
                    </div>
                </div>
                <div className="text-sm text-gray-500 hover:underline cursor-pointer">Write a description about yourself</div>
                <div>
                    <div className="flex justify-between border-b-[1px] border-gray-300">
                        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                            <Tab label="Posts" sx={{fontSize:12}} />
                            <Tab label="Question" sx={{fontSize:12}} />
                            <Tab label="Followers" sx={{fontSize:12}} />
                            <Tab label="Followings" sx={{fontSize:12}} />
                        </Tabs>
                    </div>
                </div>
            </div>
            <div className="col-span-4 bg-white">
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