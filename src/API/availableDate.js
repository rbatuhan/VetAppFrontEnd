import axios from "axios";

export const getAvailableDates = async () => {
    const {data} = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/api/v1/available-dates"
    );
    return data.content || data; // Eğer API yanıtı data.content içinde ise bu şekilde döndürün
  };

export const deleteAvailableDate = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/available-dates/${id}`
    );
    return data;
};

export const createAvailableDate = async (availableDate) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/available-dates`,
        availableDate
      );
      return data;
    } catch (error) {
      console.error('Error creating available date:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
export const updateAvailableDateFunc = async (id, availableDate) => {
    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/available-dates/${id}`,
        availableDate
    );
    return data;
};