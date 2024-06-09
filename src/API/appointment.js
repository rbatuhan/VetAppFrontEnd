import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/api/v1";

export const getAppointments = async () => {
  const { data } = await axios.get(`${BASE_URL}/appointments`);
  return data;
};

export const deleteAppointment = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/appointments/${id}`);
  return data;
};

export const createAppointment = async (appointment) => {
  const { data } = await axios.post(`${BASE_URL}/appointments`, appointment);
  return data;
};

export const updateAppointmentFunc = async (id, appointment) => {
  const { data } = await axios.put(`${BASE_URL}/appointments/${id}`, appointment);
  return data;
};

export const getAnimalAppointmentDateInRange = async (animalId, startDate, endDate, pageNumber = 0, pageSize = 10) => {
  const { data } = await axios.get(`${BASE_URL}/appointments/searchByAnimalAndDateRange`, {
    params: {
      id: animalId,
      startDate: startDate,
      endDate: endDate,
      pageNumber: pageNumber,
      pageSize: pageSize
    }
  });
  return data;
};

export const getDoctorAppointmentDateInRange = async (doctorId, startDate, endDate, pageNumber = 0, pageSize = 10) => {
  const { data } = await axios.get(`${BASE_URL}/appointments/searchByDoctorAndDateRange`, {
    params: {
      id: doctorId,
      startDate: startDate,
      endDate: endDate,
      pageNumber: pageNumber,
      pageSize: pageSize
    }
  });
  return data;
};
