// Login.js
import { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants/constant';

const Login = () => {
  const navigate = useNavigate(); // Initialize useHistory

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [error, setError ] = useState(null)

  const loginMutation = useMutation((formData) =>
    axios.post(`${BASE_URL}/auth/login`, formData)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginMutation.mutateAsync(formData);
      if (response.data.message === 'Login successful') {
        // Login successful, navigate to /home
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        navigate('/');
      }
    } catch (error) {
      setError(error.response.data.message)
    }
  };
  return (
    <div className="w-[100%] md:w-[90%] py-16 mx-auto flex justify-center items-center">
      <div className=" w-[95%] md:w-[50%] py-8 bg-white rounded-md flex flex-col shadow-lg items-center">
        <p className='md:text-3xl text-xl py-3 text-emerald-700 font-semibold'>Welcome Back</p>
        <form onSubmit={handleSubmit} className="w-[95%] md:w-[55%] mt-5 mx-auto flex flex-col gap-4">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <div className="error text-red-500">{error}</div>
          <button
            type="submit"
            className="w-full bg-emerald-700 text-white flex items-center justify-center gap-1 py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none"
          >Login</button>
          <div className="flex justify-between w-[80%] mx-auto text-sm items-center">
            <span className="text-sm text-gray-700">Do not have an account?</span>
            <Link to="/register" className="text-emerald-700">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );

};

export default Login;
