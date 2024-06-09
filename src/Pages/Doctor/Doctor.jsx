import Modal from "react-modal";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import {
  getAvailableDates,
  deleteAvailableDate,
  createAvailableDate,
  updateAvailableDateFunc,
} from "../../API/availableDate";
import {
  getDoctors,
  deleteDoctor,
  createDoctor,
  updateDoctorFunc,
} from "../../API/doctor";
import "./Doctor.css";

function AvailableDatesModal({
  isOpen,
  onClose,
  availableDates,
  doctorName,
  doctorId,
}) {
  const [availableDate, setAvailableDate] = useState([]);
  const [modalReload, setModalReload] = useState(true);
  const [newAvailableDate, setNewAvailableDate] = useState({
    availableDate: "",
    doctor: { id: doctorId },
  });
  const [updateAvailable, setUpdateAvailable] = useState({
    availableDate: "",
    doctor: { id: doctorId },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAvailableDates(doctorId);
        setAvailableDate(data);
      } catch (error) {
        console.error("Error fetching available dates:", error);
      }
      setModalReload(false);
    };

    if (modalReload) {
      fetchData();
    }
  }, [modalReload, doctorId]);

  const handleNewAvailableDate = (event) => {
    const date = new Date(event.target.value);
    const formattedDate = date.toISOString().slice(0, 16);
    setNewAvailableDate({
      ...newAvailableDate,
      availableDate: formattedDate,
    });
  };;

  const handleUpdateBtn = (aDate) => {
    setUpdateAvailable({
      id: aDate.id,
      availableDate: aDate.availableDate,
      doctor: { id: doctorId },
    });
  };

  const handleUpdateChange = (event) => {
    setUpdateAvailable({
      ...updateAvailable,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    const { id, ...availableDateData } = updateAvailable;
    await updateAvailableDateFunc(id, availableDateData);
    setModalReload(true);
    setUpdateAvailable({
      availableDate: "",
      doctor: { id: doctorId },
    });
  };

  const handleCreate = async () => {
    try {
      // ISO formatına dönüştürme
      const date = new Date(newAvailableDate.availableDate);
      const isoFormattedDate = date.toISOString();
  
      // Yeni tarih formatını mevcut nesneye yerleştirme
      const newAvailableDateWithISO = {
        ...newAvailableDate,
        availableDate: isoFormattedDate,
      };
  
      await createAvailableDate(newAvailableDateWithISO);
      setModalReload(!modalReload);
    } catch (error) {
      console.error("Error creating available date:", error.response ? error.response.data : error.message);
    }
  
    setNewAvailableDate({
      availableDate: "",
      doctor: { id: doctorId },
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteAvailableDate(id);
      setModalReload(true);
    } catch (error) {
      console.error("Error deleting available date:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`${doctorName} - Müsait Günler`}
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "600px",
          overflow: "auto",
        },
      }}
    >
      <h2>{doctorName} - Çalışma Günleri</h2>
      <div className="availableDate">
        <div className="available-newavailable">
          <h2>Yeni Çalışma Günü Ekle :</h2>
          <input
            type="datetime-local"
            placeholder="Tarih"
            name="availableDate"
            value={newAvailableDate.availableDate}
            onChange={handleNewAvailableDate}
          />
          <button onClick={handleCreate}>Ekle</button>
        </div>
        <div className="available-updateavailable">
          <h2>Çalışma Gününü Güncelle :</h2>
          <input
            type="datetime-local"
            placeholder="Tarih"
            name="availableDate"
            value={updateAvailable.availableDate || ""}
            onChange={handleUpdateChange}
          />
          <button onClick={handleUpdate}>Güncelle</button>
        </div>
        <div className="available-list">
          <h2>Çalışma Günleri</h2>
          <table>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Güncelle</th>
                <th>Sil</th>
              </tr>
            </thead>
            <tbody>
              {availableDates.map((date, index) => (
                <tr key={index}>
                  <td>{date.availableDate}</td>
                  <td onClick={() => handleUpdateBtn(date)}>
                    <UpdateIcon />
                  </td>
                  <td onClick={() => handleDelete(date.id)}>
                    <DeleteIcon />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={onClose}>Kapat</button>
    </Modal>
  );
}

function Doctor() {
  const [doctor, setDoctor] = useState([]);
  const [reload, setReload] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctorAvailableDates, setCurrentDoctorAvailableDates] =
    useState([]);
  const [currentDoctorName, setCurrentDoctorName] = useState("");
  const [currentDoctorId, setCurrentDoctorId] = useState("");

  const handleShowAvailableDates = async (selectedDoctor) => {
    try {
      const allAvailableDates = await getAvailableDates();
      const filteredDates = allAvailableDates.filter(
        (date) => date.doctor.id === selectedDoctor.id
      );

      setCurrentDoctorAvailableDates(filteredDates);
      setCurrentDoctorName(selectedDoctor.name);
      setCurrentDoctorId(selectedDoctor.id);

      setIsModalOpen(true);
    } catch (error) {
      console.error("Müsait günler getirilirken bir hata oluştu:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const handleNewDoctor = (event) => {
    setNewDoctor({
      ...newDoctor,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async () => {
    try {
      await createDoctor(newDoctor);
      setReload(true);
      setNewDoctor({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
      });
    } catch (error) {
      console.error("Error creating doctor:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setReload(true);
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const [updateDoctor, setUpdateDoctor] = useState({
    id: null,
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    setUpdateDoctor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateBtn = (doc) => {
    setUpdateDoctor({
      id: doc.id,
      name: doc.name,
      phone: doc.phone,
      email: doc.email,
      address: doc.address,
      city: doc.city,
    });
  };

  const handleUpdate = async () => {
    try {
      const { id, ...doctorData } = updateDoctor;
      await updateDoctorFunc(id, doctorData);
      setReload(true);
      setUpdateDoctor({
        id: null,
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
      });
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDoctors();
        setDoctor(data.content || data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
      setReload(false);
    };

    if (reload) {
      fetchData();
    }
  }, [reload]);

  return (
    <>
      <div className="doctor">
        <div className="doctor-newdoctor">
          <h2>Doktor Ekle :</h2>
          <input
            type="text"
            placeholder="Adı"
            name="name"
            value={newDoctor.name}
            onChange={handleNewDoctor}
          />
          <input
            type="text"
            placeholder="Telefon"
            name="phone"
            value={newDoctor.phone}
            onChange={handleNewDoctor}
          />
          <input
            type="text"
            placeholder="E-Mail"
            name="email"
            value={newDoctor.email}
            onChange={handleNewDoctor}
          />
          <input
            type="text"
            placeholder="Adres"
            name="address"
            value={newDoctor.address}
            onChange={handleNewDoctor}
          />
          <input
            type="text"
            placeholder="Şehir"
            name="city"
            value={newDoctor.city}
            onChange={handleNewDoctor}
          />
          <button onClick={handleCreate}>Ekle</button>
        </div>
        {updateDoctor.id && (
          <div className="doctor-updatedoctor">
            <h2>Doktor Güncelle :</h2>
            <input
              type="text"
              placeholder="Adı"
              name="name"
              value={updateDoctor.name}
              onChange={handleUpdateChange}
            />
            <input
              type="text"
              placeholder="Telefon"
              name="phone"
              value={updateDoctor.phone}
              onChange={handleUpdateChange}
            />
            <input
              type="text"
              placeholder="E-Mail"
              name="email"
              value={updateDoctor.email}
              onChange={handleUpdateChange}
            />
            <input
              type="text"
              placeholder="Adres"
              name="address"
              value={updateDoctor.address}
              onChange={handleUpdateChange}
            />
            <input
              type="text"
              placeholder="Şehir"
              name="city"
              value={updateDoctor.city}
              onChange={handleUpdateChange}
            />
            <button onClick={handleUpdate}>Güncelle</button>
          </div>
        )}
        <div className="doctor-list">
          <h2>Doktor Listesi</h2>
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
                <th>Çalışma Günleri</th>
              </tr>
            </thead>
            <tbody>
              {doctor.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{doc.phone}</td>
                  <td>{doc.email}</td>
                  <td>{doc.address}</td>
                  <td>{doc.city}</td>
                  <td onClick={() => handleDelete(doc.id)}>
                    <DeleteIcon />
                  </td>
                  <td onClick={() => handleUpdateBtn(doc)}>
                    <UpdateIcon />
                  </td>
                  <td onClick={() => handleShowAvailableDates(doc)}>
                    <EventAvailableIcon />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AvailableDatesModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          availableDates={currentDoctorAvailableDates}
          doctorName={currentDoctorName}
          doctorId={currentDoctorId}
        />
      </div>
    </>
  );
}

export default Doctor;
