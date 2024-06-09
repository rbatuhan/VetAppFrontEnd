import axios from 'axios';

// API Calls
export const getAppointments = async () => {
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/appointments`);
    return data;
};

export const deleteAppointment = async (id) => {
    const { data } = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/appointments/${id}`);
    return data;
};

export const createAppointment = async (appointment) => {
    const { data } = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/appointments`, appointment);
    return data;
};

export const updateAppointmentFunc = async (id, appointment) => {
    const { data } = await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/appointments/${id}`, appointment);
    return data;
};

export const getAnimalAppointmentDateInRange = async (animalId, startDate, endDate) => {
    const { data } = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/appointments/animal/date-range`, {
        params: { animalId, startDate, endDate }
    });
    return data;
};

export const getDoctorAppointmentDateInRange = async (doctorId, startDate, endDate) => {
    const { data } = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/appointments/doctor/date-range`, {
        params: { doctorId, startDate, endDate }
    });
    return data;
};