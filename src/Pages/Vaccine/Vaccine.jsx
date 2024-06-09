import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import {
  getVaccines,
  deleteVaccine,
  createVaccine,
  updateVaccineFunc,
  getVaccinesInDateRange,
  getVaccinesByAnimal,
} from "../../API/vaccine";
import { getAnimals } from "../../API/animal";
import { getReports } from "../../API/report";
import "./Vaccine.css";

function ErrorModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onClose}>Kapat</button>
      </div>
    </div>
  );
}

function Vaccine() {
  const [vaccines, setVaccines] = useState([]);
  const [reload, setReload] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [reports, setReports] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [newVaccine, setNewVaccine] = useState({
    name: "",
    code: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animal: "",
    report: "",
  });
  const [updateVaccine, setUpdateVaccine] = useState({
    id: null,
    name: "",
    code: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animal: "",
    report: "",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vaccinesData = await getVaccines();
        setVaccines(vaccinesData.content || vaccinesData);
        const animalsData = await getAnimals();
        setAnimals(animalsData.content || animalsData);
        const reportsData = await getReports();
        setReports(reportsData.content || reportsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setReload(false);
    };

    if (reload) {
      fetchData();
    }
  }, [reload]);

  const handleDelete = async (id) => {
    try {
      await deleteVaccine(id);
      setReload(true);
    } catch (error) {
      console.error("Error deleting vaccine:", error);
    }
  };

  const handleSearchByAnimalId = async () => {
    try {
      const fetchedVaccines = selectedAnimalId
        ? await getVaccinesByAnimal(selectedAnimalId)
        : await getVaccines();
      setVaccines(fetchedVaccines.content || fetchedVaccines);
    } catch (error) {
      console.error("Error searching vaccines by animal:", error);
      setVaccines([]);
    }
  };

  const handleNewVaccine = (event) => {
    const { name, value } = event.target;
    if (name === "animal") {
      const selectedAnimal = animals.find(
        (animal) => animal.id.toString() === value
      );
      setNewVaccine((prevState) => ({
        ...prevState,
        animal: selectedAnimal,
      }));
    } else if (name === "report") {
      const selectedReport = reports.find(
        (report) => report.id.toString() === value
      );
      setNewVaccine((prevState) => ({
        ...prevState,
        report: selectedReport,
      }));
    } else {
      setNewVaccine((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCreate = async () => {
    try {
      await createVaccine(newVaccine);
      setReload(true);
      setNewVaccine({
        name: "",
        code: "",
        protectionStartDate: "",
        protectionFinishDate: "",
        animal: "",
        report: "",
      });
    } catch (error) {
      setIsErrorModalOpen(true);
      setErrorMessage(
        `Aşı eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.
        Koruyuculuk başlangıç tarihi bugün ya da geçmiş tarihli olmalı.
        Aşı kodu XXX-00 formatında olmalı.`
      );
      console.error("Error creating vaccine:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedVaccine = {
        ...updateVaccine,
        animal: updateVaccine.animal ? { id: updateVaccine.animal } : null,
        report: updateVaccine.report ? { id: updateVaccine.report } : null,
      };
      const { id, ...vaccineData } = updatedVaccine;
      await updateVaccineFunc(id, vaccineData);
      setReload(true);
      setUpdateVaccine({
        id: null,
        name: "",
        code: "",
        protectionStartDate: "",
        protectionFinishDate: "",
        animal: "",
        report: "",
      });
    } catch (error) {
      setIsErrorModalOpen(true);
      setErrorMessage(
        `Aşı güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.
        Koruyuculuk başlangıç tarihi bugün ya da geçmiş tarihli olmalı.
        Aşı kodu XXX-00 formatında olmalı.`
      );
      console.error("Error updating vaccine:", error);
    }
  };

  const handleUpdateBtn = (vac) => {
    setUpdateVaccine({
      id: vac.id,
      name: vac.name,
      code: vac.code,
      protectionStartDate: vac.protectionStartDate,
      protectionFinishDate: vac.protectionFinishDate,
      animal: vac.animal ? vac.animal.id : "",
      report: vac.report ? vac.report.id : "",
    });
  };

  const handleSearchByDateRange = async () => {
    if (startDate && endDate) {
      try {
        const fetchedVaccines = await getVaccinesInDateRange(startDate, endDate);
        setVaccines(fetchedVaccines.content || fetchedVaccines);
      } catch (error) {
        console.error("Error searching vaccines by date range:", error);
      }
    } else {
      alert("Lütfen başlangıç ve bitiş tarihlerini giriniz.");
    }
  };

  const handleUpdateChange = (event) => {
    setUpdateVaccine({
      ...updateVaccine,
      [event.target.name]: event.target.value,
    });
  };

  const handleReset = async () => {
    const fetchedVaccines = await getVaccines();
    setVaccines(fetchedVaccines.content || fetchedVaccines);
    setSelectedAnimalId("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <div className="vaccine">
        <div className="animalname-search">
          <h2>Pet Seçiniz :</h2>
          <select
            value={selectedAnimalId}
            onChange={(e) => setSelectedAnimalId(e.target.value)}
          >
            <option value="">Tümünü Göster</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
          <button onClick={handleSearchByAnimalId}>Ara</button>
        </div>
        <div className="date-search">
          <h2>Tarih Aralığına Göre Filtrele :</h2>
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
          <button onClick={handleSearchByDateRange}>
            Tarih Aralığına Göre Ara
          </button>
          <button onClick={handleReset}>Sıfırla</button>
        </div>
        <div className="vaccine-newvaccine">
          <h2>Yeni Aşı :</h2>
          <input
            type="text"
            placeholder="Adı"
            name="name"
            value={newVaccine.name}
            onChange={handleNewVaccine}
          />
          <input
            type="text"
            placeholder="Kod (XXX-00)"
            name="code"
            value={newVaccine.code}
            onChange={handleNewVaccine}
          />
          <input
            type="date"
            placeholder="Koruyuculuk başlangıç"
            name="protectionStartDate"
            value={newVaccine.protectionStartDate}
            onChange={handleNewVaccine}
          />
          <input
            type="date"
            placeholder="Koruyuculuk bitiş"
            name="protectionFinishDate"
            value={newVaccine.protectionFinishDate}
            onChange={handleNewVaccine}
          />
          <select
            name="animal"
            value={newVaccine.animal?.id || ""}
            onChange={handleNewVaccine}
          >
            <option value="" disabled>
              Hayvan Seçiniz
            </option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
          <select
            name="report"
            value={newVaccine.report?.id || ""}
            onChange={handleNewVaccine}
          >
            <option value="" disabled>
              Rapor Seçiniz
            </option>
            {reports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.id} {report.title}
              </option>
            ))}
          </select>
          <button onClick={handleCreate}>Ekle</button>
        </div>
        {updateVaccine.id && (
          <div className="vaccine-updatevaccine">
            <h2>Aşıyı Güncelle :</h2>
            <input
              type="text"
              placeholder="Adı"
              name="name"
              value={updateVaccine.name}
              onChange={handleUpdateChange}
            />
            <input
              type="text"
              placeholder="Kod (XXX-00)"
              name="code"
              value={updateVaccine.code}
              onChange={handleUpdateChange}
            />
            <input
              type="date"
              placeholder="Koruyuculuk başlangıç"
              name="protectionStartDate"
              value={updateVaccine.protectionStartDate}
              onChange={handleUpdateChange}
            />
            <input
              type="date"
              placeholder="Koruyuculuk bitiş"
              name="protectionFinishDate"
              value={updateVaccine.protectionFinishDate}
              onChange={handleUpdateChange}
            />
            <select
              name="animal"
              value={updateVaccine.animal || ""}
              onChange={(e) =>
                setUpdateVaccine({
                  ...updateVaccine,
                  animal: e.target.value,
                })
              }
            >
              <option value="">Hayvan Seç</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
            <select
              name="report"
              value={updateVaccine.report || ""}
              onChange={(e) =>
                setUpdateVaccine({
                  ...updateVaccine,
                  report: e.target.value,
                })
              }
            >
              <option value="">Rapor Seç</option>
              {reports.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.title}
                </option>
              ))}
            </select>
            <button onClick={handleUpdate}>Güncelle</button>
          </div>
        )}
        <div className="vaccine-list">
          <h2>Aşı Listesi</h2>
          <table>
            <thead>
              <tr>
                <th>Aşı Adı</th>
                <th>Kod</th>
                <th>Pet Adı</th>
                <th>Koruyuculuk Başlangıç</th>
                <th>Koruyuculuk Bitiş</th>
                <th>Sil</th>
                <th>Güncelle</th>
              </tr>
            </thead>
            <tbody>
              {vaccines.map((vaccine) => (
                <tr key={vaccine.id}>
                  <td>{vaccine.name}</td>
                  <td>{vaccine.code}</td>
                  <td>{vaccine.animal ? vaccine.animal.name : "Bilinmiyor"}</td>
                  <td>{vaccine.protectionStartDate}</td>
                  <td>{vaccine.protectionFinishDate}</td>
                  <td onClick={() => handleDelete(vaccine.id)}>
                    <DeleteIcon />
                  </td>
                  <td onClick={() => handleUpdateBtn(vaccine)}>
                    <UpdateIcon />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={errorMessage}
      />
    </>
  );
}

export default Vaccine;
