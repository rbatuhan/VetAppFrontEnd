import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import {
  getCustomers,
  deleteCustomer,
  createCustomer,
  updateCustomerFunc,
  getCustomersByName,
} from "../../API/customer";
import "./Customer.css";

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [reload, setReload] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });
  const [updateCustomer, setUpdateCustomer] = useState({
    id: null,
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data.content || data); // data.content eklemesi pagination için
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchData();
  }, [reload]);

  const handleSearch = async () => {
    try {
      const data = searchQuery
        ? await getCustomersByName(searchQuery)
        : await getCustomers();
      setCustomers(data.content || data);
    } catch (error) {
      console.error("Error searching customers:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      setReload(!reload);
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleUpdate = async () => {
    const { id, ...customerData } = updateCustomer;
    try {
      await updateCustomerFunc(id, customerData);
      setReload(!reload);
      setUpdateCustomer({
        id: null,
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
      });
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleNewCustomerChange = (event) => {
    setNewCustomer({
      ...newCustomer,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async () => {
    try {
      await createCustomer(newCustomer);
      setReload(!reload);
      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
      });
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleUpdateBtn = (cus) => {
    setUpdateCustomer({
      id: cus.id,
      name: cus.name,
      phone: cus.phone,
      email: cus.email,
      address: cus.address,
      city: cus.city,
    });
  };

  const handleUpdateChange = (event) => {
    setUpdateCustomer({
      ...updateCustomer,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="customer">
      <div className="customer-search">
        <h2>İsme göre filtrele :</h2>
        <input
          type="text"
          placeholder="Tam Adını Yazınız"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Ara</button>
      </div>
      <div className="customer-newcustomer">
        <h2>Yeni Müşteri Ekle :</h2>
        <input
          type="text"
          placeholder="Adı"
          name="name"
          value={newCustomer.name}
          onChange={handleNewCustomerChange}
        />
        <input
          type="text"
          placeholder="Telefon (555-555-5555)"
          name="phone"
          value={newCustomer.phone}
          onChange={handleNewCustomerChange}
        />
        <input
          type="text"
          placeholder="E-Mail"
          name="email"
          value={newCustomer.email}
          onChange={handleNewCustomerChange}
        />
        <input
          type="text"
          placeholder="Adres"
          name="address"
          value={newCustomer.address}
          onChange={handleNewCustomerChange}
        />
        <input
          type="text"
          placeholder="Şehir"
          name="city"
          value={newCustomer.city}
          onChange={handleNewCustomerChange}
        />
        <button onClick={handleCreate}>Ekle</button>
      </div>
      <div className="customer-updatecustomer">
        <h2>Müşteri Güncelle :</h2>
        <input
          type="text"
          placeholder="Adı"
          name="name"
          value={updateCustomer.name}
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          placeholder="Telefon (555-555-5555)"
          name="phone"
          value={updateCustomer.phone}
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          placeholder="E-Mail"
          name="email"
          value={updateCustomer.email}
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          placeholder="Adres"
          name="address"
          value={updateCustomer.address}
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          placeholder="Şehir"
          name="city"
          value={updateCustomer.city}
          onChange={handleUpdateChange}
        />
        <button onClick={handleUpdate}>Güncelle</button>
      </div>
      <div className="customer-list">
        <h2>Müşteri Listesi</h2>
        <table>
          <thead>
            <tr>
              <th>İsim</th>
              <th>Telefon</th>
              <th>E-posta</th>
              <th>Adres</th>
              <th>Şehir</th>
              <th>Sil</th>
              <th>Güncelle</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(customers) &&
              customers.map((cus) => (
                <tr key={cus.id}>
                  <td>{cus.name}</td>
                  <td>{cus.phone}</td>
                  <td>{cus.email}</td>
                  <td>{cus.address}</td>
                  <td>{cus.city}</td>
                  <td onClick={() => handleDelete(cus.id)}>
                    <DeleteIcon />
                  </td>
                  <td onClick={() => handleUpdateBtn(cus)}>
                    <UpdateIcon />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customer;