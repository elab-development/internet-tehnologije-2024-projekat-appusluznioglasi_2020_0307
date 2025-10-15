import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { Button, Row } from "react-bootstrap";
import ServiceCard from "./ServiceCard";

const Services=()=>{
 const { user } = useStateContext();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    axiosClient
      .get("/services/my-services")
      .then(({ data }) => {
        setServices(data.services || []);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju usluga:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <p>Učitavanje usluga...</p>;
  }

  return (
    <div>
      <h2 className="mb-3">Moje usluge</h2>

      {services.length === 0 ? (
        <p>Trenutno nemate dodate usluge.</p>
      ) : (
        <Row>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </Row>
      )}

      <div className="text-center mt-4">
        <Button
          variant="primary"
          onClick={() =>
            alert("Dodavanje nove usluge će biti implementirano kasnije.")
          }
        >
          Dodaj novu uslugu
        </Button>
      </div>
    </div>
  );
};
export default Services
