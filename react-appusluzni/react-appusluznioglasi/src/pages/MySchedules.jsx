import { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { Button, Form, Table } from "react-bootstrap";

const MySchedules = () => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(""); // odmah se puni prvom uslugom
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ date: "", time_from: "", time_to: "", assigned_employees: 1 });
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await axiosClient.get("/services/my-services");
      const list = data.services || [];
      setServices(list);

      // ✅ Ako postoji bar jedna usluga – odmah selektuj prvu i učitaj termine
      if (list.length > 0) {
        setSelectedServiceId(list[0].id);
        loadSchedules(list[0].id);
      }
    };

    fetchServices();
  }, []);

  const loadSchedules = async (id) => {
    setLoading(true);
    const { data } = await axiosClient.get(`/schedules/service/${id}/all`);
    setSchedules(data.schedules || []);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await axiosClient.post("/schedules", { 
        ...form, 
        service_id: selectedServiceId 
      });

      await loadSchedules(selectedServiceId);
      setForm({ date: "", time_from: "", time_to: "", assigned_employees: 1 });

      setSuccessMessage("Termin je uspešno dodat!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = err.response.data;
        if (errors.time_to) {
          setErrorMessage("Vreme završetka mora biti posle vremena početka.");
        } else if (errors.date) {
          setErrorMessage("Datum mora biti današnji ili u budućnosti.");
        } else {
          setErrorMessage("Greška: Proverite unete podatke.");
        }
      } else {
        setErrorMessage("Greška pri povezivanju sa serverom.");
      }
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleDelete = async (id) => {
    await axiosClient.delete(`/schedules/${id}`);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="container mt-4">
      <h3>Upravljanje terminima</h3>

      {/* Dropdown – bez "Izaberi uslugu", odmah postavljena prva */}
      <Form.Select
        className="my-3"
        value={selectedServiceId}
        onChange={(e) => {
          setSelectedServiceId(e.target.value);
          loadSchedules(e.target.value);
        }}
      >
        {services.map((s) => (
          <option key={s.id} value={s.id}>{s.title}</option>
        ))}
      </Form.Select>

      {/* Poruke */}
      <div className="my-3">
        {successMessage && (
          <div className="alert alert-success text-center fw-semibold shadow-sm">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="alert alert-danger text-center fw-semibold shadow-sm">{errorMessage}</div>
        )}
      </div>

      {/* Tabela termina */}
      {selectedServiceId && (
        <>
          {loading ? (
            <p>Učitavanje termina...</p>
          ) : schedules.length === 0 ? (
            <p>Nema zakazanih termina za ovu uslugu.</p>
          ) : (
            <Table className="table table-hover align-middle custom-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Od</th>
                  <th>Do</th>
                  <th>Zaposleni</th>
                  <th>Status</th>
                  <th>Akcija</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((sch) => (
                  <tr key={sch.id} className={sch.is_booked ? "booked" : ""}>
                    <td>{sch.date}</td>
                    <td>{sch.time_from}</td>
                    <td>{sch.time_to}</td>
                    <td>{sch.employees_assigned}</td>
                    <td>
                      {sch.is_booked ? (
                        <span className="text-danger fw-bold">Zauzet</span>
                      ) : (
                        <span className="text-success fw-bold">Slobodan</span>
                      )}
                    </td>
                    <td>
                      {!sch.is_booked && (
                        <Button className="btn-delete" onClick={() => handleDelete(sch.id)}>
                          Obriši
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Forma za novi termin */}
          <Form onSubmit={handleAdd} className="d-flex gap-2 mt-3">
            <Form.Control type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Form.Control type="time" value={form.time_from} onChange={(e) => setForm({ ...form, time_from: e.target.value })} required />
            <Form.Control type="time" value={form.time_to} onChange={(e) => setForm({ ...form, time_to: e.target.value })} required />
            <Form.Control type="number" min="1" value={form.assigned_employees} onChange={(e) => setForm({ ...form, assigned_employees: e.target.value })} />
            <Button type="submit">Dodaj</Button>
          </Form>
        </>
      )}
    </div>
  );
};

export default MySchedules;
