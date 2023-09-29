import axios from "axios";
import { BASE_URL } from "../../constants/constant";

// const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');


export const fetchO_Questions = async (orbitId) => {
    try {
      const response = await axios.get(`${BASE_URL}/orbit/get_questions/${orbitId}`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
};

export const fetchO_Answers = async (questionId) => {
    try {
      const response = await axios.get(`${BASE_URL}/orbit/read_answers/${questionId}`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
};
export const followOrbit = async (orbitId, refetchOrbit) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/orbit/${orbitId}/follow`,
        {},
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      refetchOrbit()
      return response.data;
    } catch (error) {
      throw Error (error.message)
    }
};

export const unFollowOrbit = async (orbitId, refetchOrbit) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/orbit/${orbitId}/un_follow`,
        {},
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      refetchOrbit()
      return response.data;
    } catch (error) {
      throw Error (error.message)
    }
};

export const fetchFollowingOrbits = async (orbitIds) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/orbit/read_orbits_ids`,
        {orbitIds},
        {
          headers: {
            "Authorization" : token,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw Error (error.message)
    }
};