import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import {
  getReports,
  deleteReport,
  createReport,
  updateReportFunc,
} from "../../API/report";
import { getAppointments } from "../../API/appointment"; // Appointment API'sini buraya ekleyin
import "./Report.css";

function Report() {
  const [reports, setReports] = useState([]);
  const [reload, setReload] = useState(true);
  const [newReport, setNewReport] = useState({
    title: "",
    diagnosis: "",
    price: "",
    appointment: "",
  });
  const [updateReport, setUpdateReport] = useState({
    id: "",
    title: "",
    diagnosis: "",
    price: "",
    appointment: "",
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    setLoading(true);
    const { id, ...reportData } = updateReport;
    updateReportFunc(id, reportData).then(() => {
      setReload(true);
      setLoading(false);
    }).catch(error => {
      console.error("Error updating report:", error);
      setLoading(false);
    });
  };

  const handleDelete = (id) => {
    setLoading(true);
    deleteReport(id).then(() => {
      setReload(true);
      setLoading(false);
    }).catch(error => {
      console.error("Error deleting report:", error);
      setLoading(false);
    });
  };

  const handleNewReport = (event) => {
    const { name, value } = event.target;
    if (name === "appointment") {
      setNewReport({
        ...newReport,
        appointment: { id: value },
      });
    } else {
      setNewReport({
        ...newReport,
        [name]: value,
      });
    }
  };

  const handleCreate = () => {
    setLoading(true);
    createReport(newReport).then(() => {
      setReload(true);
      setLoading(false);
      setNewReport({
        title: "",
        diagnosis: "",
        price: "",
        appointment: "",
      });
    }).catch(error => {
      console.error("Error creating report:", error);
      setLoading(false);
    });
  };

  const handleUpdateBtn = (rep) => {
    setUpdateReport({
      id: rep.id,
      title: rep.title,
      diagnosis: rep.diagnosis,
      price: rep.price,
      appointment: rep.appointment.id,
    });
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    if (name === "appointment") {
      setUpdateReport({
        ...updateReport,
        appointment: { id: value },
      });
    } else {
      setUpdateReport({
        ...updateReport,
        [name]: value,
      });
    }
  };

  const preventNegative = (event) => {
    if (event.key === "-") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (reload) {
      setLoading(true);
      getReports().then((data) => {
        if (Array.isArray(data)) {
          setReports(data);
        } else {
          setReports([]);
        }
        setLoading(false);
      }).catch(error => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      });

      getAppointments().then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          setAppointments([]);
        }
      }).catch(error => {
        console.error("Error fetching appointments:", error);
      });

      setReload(false);
    }
  }, [reload]);

  return (
    <div className="report">
      <div className="report-newreport">
        <h2>Yeni Rapor Ekle :</h2>
        <input
          type="text"
          placeholder="Başlık"
          name="title"
          value={newReport.title}
          onChange={handleNewReport}
        />
        <input
          type="text"
          placeholder="Tanı"
          name="diagnosis"
          value={newReport.diagnosis}
          onChange={handleNewReport}
        />
        <input
          type="number"
          placeholder="Tutar"
          name="price"
          min={0}
          value={newReport.price}
          onKeyDown={preventNegative}
          onChange={handleNewReport}
        />
        <select
          name="appointment"
          value={newReport.appointment.id || ""}
          onChange={handleNewReport}
        >
          <option value="" disabled>
            Randevu Seçiniz
          </option>
          {Array.isArray(appointments) && appointments.length > 0 ? (
            appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                {appointment.appointmentDate} {appointment.doctor.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No Appointments Available
            </option>
          )}
        </select>
        <button onClick={handleCreate}>Ekle</button>
      </div>
      <div className="report-updatereport">
        <h2>Rapor Güncelle :</h2>
        <input
          type="text"
          placeholder="Başlık"
          name="title"
          value={updateReport.title}
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          placeholder="Tanı"
          name="diagnosis"
          value={updateReport.diagnosis}
          onChange={handleUpdateChange}
        />
        <input
          type="number"
          placeholder="Tutar"
          name="price"
          min={0}
          onKeyDown={preventNegative}
          value={updateReport.price}
          onChange={handleUpdateChange}
        />
        <select
          name="appointment"
          value={updateReport.appointment.id || ""}
          onChange={handleUpdateChange}
        >
          <option value="" disabled>
            Randevu Seçiniz
          </option>
          {Array.isArray(appointments) && appointments.length > 0 ? (
            appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                {appointment.appointmentDate} {appointment.doctor.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No Appointments Available
            </option>
          )}
        </select>
        <button onClick={handleUpdate}>Güncelle</button>
      </div>
      <div className="report-list">
        <h2>Rapor Listesi</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Tanı</th>
                <th>Fiyat</th>
                <th>Randevu Tarihi</th>
                <th>Sil</th>
                <th>Güncelle</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(reports) && reports.length > 0 ? (
                reports.map((rep) => (
                  <tr key={rep.id}>
                    <td>{rep.title}</td>
                    <td>{rep.diagnosis}</td>
                    <td>{rep.price}</td>
                    <td>{rep.appointment.appointmentDate}</td>
                    <td onClick={() => handleDelete(rep.id)}>
                      <DeleteIcon />
                    </td>
                    <td onClick={() => handleUpdateBtn(rep)}>
                      <UpdateIcon />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No reports available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Report;
