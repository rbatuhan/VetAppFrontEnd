import Modal from "react-modal";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import { getAnimals } from "../../API/animal";
import { getDoctors } from "../../API/doctor";
import {
  getAppointments,
  deleteAppointment,
  createAppointment,
  updateAppointmentFunc,
  getAnimalAppointmentDateInRange,
  getDoctorAppointmentDateInRange,
} from "../../API/appointment";
import "./Appointment.css";

function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [reload, setReload] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  Modal.setAppElement("#root");

  const [newAppointment, setNewAppointment] = useState({
    appointmentDate: "",
    animal: "",
    doctor: "",
    report: "",
  });

  const handleNewAppointment = (event) => {
    const { name, value } = event.target;
    setNewAppointment({
      ...newAppointment,
      [name]: name === "animal" || name === "doctor" ? { id: value } : value,
    });
  };

  const handleCreate = async () => {
    try {
      await createAppointment({ ...newAppointment, report: null });
      setReload(true);
      setNewAppointment({ appointmentDate: "", animal: "", doctor: "", report: "" });
    } catch (error) {
      console.error("Creation failed:", error);
      setErrorMessage("Doktor bugün çalışmıyor! / Bu saatteki randevusu dolu!");
      setIsErrorModalOpen(true);
    }
  };

  const [updateAppointment, setUpdateAppointment] = useState({
    appointmentDate: "",
    animal: "",
    doctor: "",
    report: "",
  });

  const handleUpdateBtn = (appointment) => {
    setUpdateAppointment({
      id: appointment.id,
      appointmentDate: appointment.appointmentDate,
      animal: appointment.animal.id,
      doctor: appointment.doctor.id,
    });
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    setUpdateAppointment({
      ...updateAppointment,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    if (updateAppointment.id) {
      const { id, animal, doctor, ...appointmentDetails } = updateAppointment;
      const updatedAppointment = {
        ...appointmentDetails,
        animal: { id: animal },
        doctor: { id: doctor },
      };
      try {
        await updateAppointmentFunc(id, updatedAppointment);
        setReload(true);
        setUpdateAppointment({ appointmentDate: "", animal: "", doctor: "", report: "" });
      } catch (error) {
        console.error("Update failed:", error);
        setErrorMessage("Güncelleme işlemi başarısız oldu!");
        setIsErrorModalOpen(true);
      }
    } else {
      console.error("Appointment ID is undefined.");
    }
  };

  const handleDelete = async (id) => {
    await deleteAppointment(id);
    setReload(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, animalsData, doctorsData] = await Promise.all([
          getAppointments(),
          getAnimals(),
          getDoctors(),
        ]);
        setAppointments(appointmentsData);
        setAnimals(animalsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Veri yükleme sırasında hata oluştu:", error);
      } finally {
        setReload(false);
      }
    };

    if (reload) fetchData();
  }, [reload]);

  const handleSearchByDoctorAndDateRange = async () => {
    if (selectedDoctorId && startDate && endDate) {
      try {
        const appointments = await getDoctorAppointmentDateInRange(selectedDoctorId, startDate, endDate);
        setAppointments(appointments);
      } catch (error) {
        console.error("Arama sırasında bir hata oluştu", error);
      }
    }
  };

  const handleSearchByAnimalAndDateRange = async () => {
    if (selectedAnimalId && startDate && endDate) {
      try {
        const appointments = await getAnimalAppointmentDateInRange(selectedAnimalId, startDate, endDate);
        setAppointments(appointments);
      } catch (error) {
        console.error("Arama sırasında bir hata oluştu", error);
      }
    }
  };

  const handleResetAppointments = async () => {
    try {
      const fetchedAppointments = await getAppointments();
      setAppointments(fetchedAppointments);
      setSelectedDoctorId("");
      setSelectedAnimalId("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Randevuları yeniden yükleme sırasında bir hata oluştu", error);
    }
  };

  return (
    <>
      <div className="appointment">
        <div className="appointment-search">
          <div className="doctor-daterange">
            <h2>Doktora Göre Arama Yap :</h2>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">Doktor Seçiniz</option>
              {Array.isArray(doctors) && doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={handleSearchByDoctorAndDateRange}>Ara</button>
          </div>
          <div className="animal-daterange">
            <h2>Pet'e Göre Arama Yap :</h2>
            <select
              value={selectedAnimalId}
              onChange={(e) => setSelectedAnimalId(e.target.value)}
            >
              <option value="">Pet Seçiniz</option>
              {Array.isArray(animals) && animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={handleSearchByAnimalAndDateRange}>Ara</button>
            <button onClick={handleResetAppointments}>Arama Verilerini Sıfırla</button>
          </div>
        </div>
        <div className="appointment-newappointment">
          <h2>Yeni Randevu Ekle :</h2>
          <form>
            <input
              type="datetime-local"
              name="appointmentDate"
              value={newAppointment.appointmentDate}
              onChange={handleNewAppointment}
            />
            <select
              name="animal"
              value={newAppointment.animal.id}
              onChange={handleNewAppointment}
            >
              <option value="">Pet Seçiniz</option>
              {Array.isArray(animals) && animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
            <select
              name="doctor"
              value={newAppointment.doctor.id}
              onChange={handleNewAppointment}
            >
              <option value="">Doktor Seçiniz</option>
              {Array.isArray(doctors) && doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleCreate}>
              Randevu Ekle
            </button>
          </form>
        </div>
        <div className="appointment-list">
          <h2>Randevular</h2>
          {Array.isArray(appointments) && appointments.length > 0 ? (
            <ul>
              {appointments.map((appointment) => (
                <li key={appointment.id}>
                  <span>Tarih: {appointment.appointmentDate}</span>
                  <span>Pet: {appointment.animal.name}</span>
                  <span>Doktor: {appointment.doctor.name}</span>
                  <button onClick={() => handleUpdateBtn(appointment)}>
                    <UpdateIcon />
                  </button>
                  <button onClick={() => handleDelete(appointment.id)}>
                    <DeleteIcon />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Randevu bulunmamaktadır</p>
          )}
        </div>
        <Modal isOpen={isErrorModalOpen} onRequestClose={() => setIsErrorModalOpen(false)}>
          <h2>Hata</h2>
          <p>{errorMessage}</p>
          <button onClick={() => setIsErrorModalOpen(false)}>Kapat</button>
        </Modal>
      </div>
    </>
  );
}

export default Appointment;