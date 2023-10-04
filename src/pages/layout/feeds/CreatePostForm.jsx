// CreatePostForm.js
import { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AiFillPicture, AiOutlineSend } from 'react-icons/ai';


const CreatePostForm = ({ onCreatePost, refetch}) => {
  const [value, setValue] = useState('');
  const [photos, setPhotos] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [filenameArray, setFilenameArray] = useState(null);
  const handlePhoto = (event) => {
    const selectedPhotos = event.target.files;
    setPhotos(selectedPhotos)
    // Extract filenames from the selected photos and create a list
    const filenamesList = Array.from(selectedPhotos).map((photo) => photo.name);
    // Create a string containing the list of filenames
    setFilenameArray(filenamesList)
  };
  const handleCreatePost = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', value);
    if (photos?.length > 0) {
      // Append images to formData only when there are images in the photos array
      for (let i = 0; i < photos?.length; i++) {
        formData.append('images', photos[i]);
      }
    }
    // Call the onCreatePost function passed from the parent component
    onCreatePost(formData);
    // Clear the form inputs
    refetch()
    setValue("")
    setShowButton(false)
  };
  const handleEditorChange = (content) => {
    setValue(content);
    setShowButton(!!content); // Show the button if content is not empty
  };
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
    ],
  };
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
  ];
  const fileInputRef = useRef();

  return (
    <div>
      <div className='relative mb-2'>
          <ReactQuill theme="snow" style={{border:"2px solid gray", background:"white", color:"black"}} placeholder='What do you wanna share?' value={value} onChange={handleEditorChange} modules={modules}
          formats={formats} />
          {showButton && (
            <div className='flex gap-2 absolute right-0 bottom-[0px] '>
              
              <label>
                <input
                  type="file"
                  className=""
                  accept="image/*"
                  multiple
                  style={{display:"none"}}
                  ref={fileInputRef} // Create a ref for the input element
                  onChange={handlePhoto}
                />
                <button onClick={() => fileInputRef.current.click()} className="font-bold"><AiFillPicture size={20} color='#4f1179' /> </button>
              </label>
              <button onClick={handleCreatePost} className='font-bold'><AiOutlineSend size={20} color='#4f1179' /></button>
            </div>
          )}
      </div>
          <div className='flex gap-1 my-1 flex-wrap'>
            {filenameArray?.map((file, idx)=>(
              <div key={idx} className='text-[10px] text-white bg-[#4f1179] p-1 rounded-sm'>{file}</div>
            ))}
          </div>
    </div>
  );
};

export default CreatePostForm;
