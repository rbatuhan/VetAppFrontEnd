import axios from 'axios';

export const getCustomers = async () => {
    const {data} = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/api/v1/customers");
    return data;
};

export const deleteCustomer = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/customers/${id}`
    );
    return data;
};

export const createCustomer = async (customer) => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/customers`,
        customer
    );
    return data;
};

export const updateCustomerFunc = async (id, customer) => {
    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/customers/${id}`,
        customer
    );
    return data;
};

export const getCustomersByName = async (name, pageNumber = 0, pageSize = 10) => {
    const encodedName = encodeURIComponent(name);
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/customers/searchByName`, {
            params: {
                name: encodedName,
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    return data;
};