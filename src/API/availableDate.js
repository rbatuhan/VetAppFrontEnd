import axios from "axios";

export const getAvailableDates = async () => {
    const {data} = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/api/v1/available-date");
    return data;
};

export const deleteAvailableDate = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/available-date/${id}`
    );
    return data;
};

export const createAvailableDate = async (availableDate) => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/available-date`,
        availableDate
    );
    return data;
};

export const updateAvailableDateFunc = async (id, availableDate) => {
    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/available-date/${id}`,
        availableDate
    );
    return data;
};