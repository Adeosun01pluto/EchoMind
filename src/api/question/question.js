import axios from "axios";
import { BASE_URL } from "../../constants/constant";

// const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');


export const fetchAnswers = async (questionId) => {
    try {
      const response = await axios.get(`${BASE_URL}/question/read_answers/${questionId}`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
};