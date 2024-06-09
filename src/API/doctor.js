import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/api/v1";

export const getDoctors = async () => {
  const { data } = await axios.get(`${BASE_URL}/doctors`);
  return data;
};

export const deleteDoctor = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/doctors/${id}`);
  return data;
};

export const createDoctor = async (doctor) => {
  const { data } = await axios.post(`${BASE_URL}/doctors`, doctor);
  return data;
};

export const updateDoctorFunc = async (id, doctor) => {
  const { data } = await axios.put(`${BASE_URL}/doctors/${id}`, doctor);
  return data;
};
