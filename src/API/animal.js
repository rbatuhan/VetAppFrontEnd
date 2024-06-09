import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/api/v1";

export const getAnimals = async () => {
    const { data } = await axios.get(`${BASE_URL}/animals`);
    return data;
};

export const deleteAnimal = async (id) => {
    const { data } = await axios.delete(`${BASE_URL}/animals/${id}`);
    return data;
};

export const createAnimal = async (animal) => {
    const { data } = await axios.post(`${BASE_URL}/animals`, animal);
    return data;
};

export const updateAnimalFunc = async (id, animal) => {
    const { data } = await axios.put(`${BASE_URL}/animals/${id}`, animal);
    return data;
};

export const getAnimalsByCustomer = async (customerName, pageNumber = 0, pageSize = 10) => {
    const encodedCustomerName = encodeURIComponent(customerName);
    const { data } = await axios.get(`${BASE_URL}/animals/searchByCustomer`, {
        params: {
            customerName: encodedCustomerName,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
    });
    return data;
};

export const getAnimalsByName = async (name, pageNumber = 0, pageSize = 10) => {
    const encodedName = encodeURIComponent(name);
    const { data } = await axios.get(`${BASE_URL}/animals/searchByName`, {
        params: {
            name: encodedName,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
    });
    return data;
};
