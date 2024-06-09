import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/api/v1";

export const getVaccines = async (pageNumber = 0, pageSize = 10) => {
  const { data } = await axios.get(`${BASE_URL}/vaccinations`, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return data;
};

export const deleteVaccine = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/vaccinations/${id}`);
  return data;
};

export const createVaccine = async (vaccine) => {
  const { data } = await axios.post(`${BASE_URL}/vaccinations`, vaccine);
  return data;
};

export const updateVaccineFunc = async (id, vaccine) => {
  const { data } = await axios.put(`${BASE_URL}/vaccinations/${id}`, vaccine);
  return data;
};

export const getVaccinesInDateRange = async (startDate, endDate, pageNumber = 0, pageSize = 10) => {
  const { data } = await axios.get(`${BASE_URL}/vaccinations/searchByVaccinationRange`, {
    params: {
      startDate,
      endDate,
      pageNumber,
      pageSize,
    },
  });
  return data;
};

export const getVaccinesByAnimal = async (animalId) => {
  const { data } = await axios.get(`${BASE_URL}/vaccinations/searchByAnimal`, {
    params: { id: animalId },
  });
  return data;
};
