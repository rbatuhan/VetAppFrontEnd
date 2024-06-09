import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import {
  getAnimals,
  deleteAnimal,
  createAnimal,
  updateAnimalFunc,
  getAnimalsByCustomer,
  getAnimalsByName,
} from "../../API/animal";
import { getCustomers } from "../../API/customer";
import "./Animal.css";

export default function Animal() {
  const [animals, setAnimals] = useState([]);
  const [reload, setReload] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    colour: "",
    dateOfBirth: "",
    customer: "",
  });
  const [searchQueryAnimal, setSearchQueryAnimal] = useState("");
  const [searchQueryCustomer, setSearchQueryCustomer] = useState("");

  const handleSearchByAnimalName = async () => {
    try {
      const fetchedAnimals = searchQueryAnimal
        ? await getAnimalsByName(searchQueryAnimal)
        : await getAnimals();
      setAnimals(fetchedAnimals.content || fetchedAnimals);
    } catch (error) {
      console.error("Error searching animals by name:", error);
    }
  };

  const handleSearchByCustomerId = async () => {
    try {
      const fetchedAnimals = searchQueryCustomer
        ? await getAnimalsByCustomer(searchQueryCustomer)
        : await getAnimals();
      setAnimals(fetchedAnimals.content || fetchedAnimals);
    } catch (error) {
      console.error("Error searching animals by customer:", error);
    }
  };

  const handleNewAnimal = (event) => {
    setNewAnimal({
      ...newAnimal,
      [event.target.name]:
        event.target.name === "customer"
          ? { id: event.target.value }
          : event.target.value,
    });
  };

  const handleCreate = async () => {
    try {
      await createAnimal(newAnimal);
      setReload(!reload);
      setNewAnimal({
        name: "",
        species: "",
        breed: "",
        gender: "",
        colour: "",
        dateOfBirth: "",
        customer: "",
      });
    } catch (error) {
      console.error("Error creating animal:", error);
    }
  };

  const [updateAnimal, setUpdateAnimal] = useState({
    id: null,
    name: "",
    species: "",
    breed: "",
    gender: "",
    colour: "",
    dateOfBirth: "",
    customer: "",
  });

  const handleUpdateBtn = (animal) => {
    setUpdateAnimal({
      id: animal.id,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      gender: animal.gender,
      colour: animal.colour,
      dateOfBirth: animal.dateOfBirth,
      customer: animal.customer ? animal.customer.id : "",
    });
  };

  const handleUpdateChange = (event) => {
    setUpdateAnimal({
      ...updateAnimal,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedAnimal = {
        ...updateAnimal,
        customer: updateAnimal.customer ? { id: updateAnimal.customer } : null,
      };
      const { id, ...animalData } = updatedAnimal;
      await updateAnimalFunc(id, animalData);
      setReload(!reload);
      setUpdateAnimal({
        id: null,
        name: "",
        species: "",
        breed: "",
        gender: "",
        colour: "",
        dateOfBirth: "",
        customer: "",
      });
    } catch (error) {
      console.error("Error updating animal:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnimal(id);
      setReload(!reload);
    } catch (error) {
      console.error("Error deleting animal:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animalsData = await getAnimals();
        setAnimals(animalsData.content || animalsData);
        const customersData = await getCustomers();
        setCustomers(customersData.content || customersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setReload(false);
    };

    if (reload) {
      fetchData();
    }
  }, [reload]);

  return (
    <div className="animal">
      <div className="input-petname">
        <h2>Pet ismine göre filtrele :</h2>
        <input
          type="text"
          placeholder="Pet adıyla ara"
          value={searchQueryAnimal}
          onChange={(e) => setSearchQueryAnimal(e.target.value)}
        />
        <button onClick={handleSearchByAnimalName}>Ara</button>
      </div>
      <div className="input-customername">
        <h2>Müşteri ismine göre filtrele :</h2>
        <select
          value={searchQueryCustomer}
          onChange={(e) => setSearchQueryCustomer(e.target.value)}
        >
          <option value="">Tümünü Göster</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <button onClick={handleSearchByCustomerId}>Ara</button>
      </div>
      <div className="animal-newanimal">
        <h2>Yeni Pet Ekle :</h2>
        <input
          type="text"
          placeholder="Adı"
          name="name"
          value={newAnimal.name}
          onChange={handleNewAnimal}
        />
        <input
          type="text"
          placeholder="Tür"
          name="species"
          value={newAnimal.species}
          onChange={handleNewAnimal}
        />
        <input
          type="text"
          placeholder="Cins"
          name="breed"
          value={newAnimal.breed}
          onChange={handleNewAnimal}
        />
        <select
          name="gender"
          value={newAnimal.gender}
          onChange={handleNewAnimal}
        >
          <option value="" disabled>
            Cinsiyet Seçiniz
          </option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
        <input
          type="text"
          placeholder="Renk"
          name="colour"
          value={newAnimal.colour}
          onChange={handleNewAnimal}
        />
        <input
          type="date"
          placeholder="Doğum Tarihi"
          name="dateOfBirth"
          value={newAnimal.dateOfBirth}
          onChange={handleNewAnimal}
        />
        <select
          name="customer"
          value={newAnimal?.customer?.id || ""}
          onChange={handleNewAnimal}
        >
          <option value="" disabled>
            Müşteri Seçiniz
          </option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreate}>Ekle</button>
      </div>
      <div className="animal-updateanimal">
        <h2>Pet Güncelle :</h2>
        <input
          type="text"
          placeholder="Adı"
          name="name"
          value={updateAnimal.name}
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          placeholder="Tür"
          name="species"
          value={updateAnimal.species}
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          placeholder="Cins"
          name="breed"
          value={updateAnimal.breed}
          onChange={handleUpdateChange}
        />
        <select
          name="gender"
          value={updateAnimal.gender}
          onChange={handleUpdateChange}
        >
          <option value="" disabled>
            Cinsiyet Seçiniz
          </option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
        <input
          type="text"
          placeholder="Renk"
          name="colour"
          value={updateAnimal.colour}
          onChange={handleUpdateChange}
        />
        <input
          type="date"
          placeholder="Doğum Tarihi"
          name="dateOfBirth"
          value={updateAnimal.dateOfBirth}
          onChange={handleUpdateChange}
        />
        <select
          name="customer"
          value={updateAnimal.customer}
          onChange={handleUpdateChange}
        >
          <option value="" disabled>
            Müşteri Seçiniz
          </option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <button onClick={handleUpdate}>Güncelle</button>
      </div>
      <div className="animal-list">
        <h2>Pet Listesi</h2>
        <table>
          <thead>
            <tr>
              <th>İsim</th>
              <th>Tür</th>
              <th>Irk</th>
              <th>Cinsiyet</th>
              <th>Renk</th>
              <th>Doğum Tarihi</th>
              <th>Sahibi</th>
              <th>Sil</th>
              <th>Güncelle</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => (
              <tr key={animal.id}>
                <td>{animal.name}</td>
                <td>{animal.species}</td>
                <td>{animal.breed}</td>
                <td>{animal.gender}</td>
                <td>{animal.colour}</td>
                <td>{animal.dateOfBirth}</td>
                <td>{animal.customer ? animal.customer.name : "Sahipsiz"}</td>
                <td onClick={() => handleDelete(animal.id)}>
                  <DeleteIcon />
                </td>
                <td onClick={() => handleUpdateBtn(animal)}>
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
