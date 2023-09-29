import axios from "axios";
import { BASE_URL } from "../../constants/constant";

// const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
export const fetchP_Questions = async ( level, faculty, course) => {
    try {
      const response = await axios.get(`${BASE_URL}/practice/read_questions?level=${level}&faculty=${faculty}&course=${course}`, 
      // {
        // params: { level, faculty, course }
      // },
      {
        headers: {
          Authorization: token,
        },
      });
      return response.data.data;
    } catch (error) {
      throw Error (error.message);
    }
};

export const fetchP_Quiz = async ( level, faculty, course,limit) => {
    try {
      const response = await axios.get(`${BASE_URL}/practice/get_quiz?level=${level}&faculty=${faculty}&course=${course}&limit=${limit}`, 
      // {
        // params: { level, faculty, course }
      // },
      {
        headers: {
          Authorization: token,
        },
      });
      return response.data.data;
    } catch (error) {
      throw Error (error.message);
    }
};
