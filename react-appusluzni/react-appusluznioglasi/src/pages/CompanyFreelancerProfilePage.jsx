import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import avatarImage from "../assets/profile-avatar.jpg";

const CompanyFreelancerProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useStateContext();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]); // samo prikazane (limit 3)
  const [totalServicesCount, setTotalServicesCount] = useState(0); // ✅ broj svih usluga korisnika
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRandomItems = (arr, n) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(n, arr.length));
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        let profileData = user;
        let servicesRes;
        let reviewsRes;

        if (user.role === "company") {
          const companyRes = await axiosClient.get(`/companies/my`);
          profileData = companyRes.data.company || companyRes.data;

          servicesRes = await axiosClient.get(`/services/my-services`);
          reviewsRes = await axiosClient.get(`/reviews/company/by-user`);

        } else if (user.role === "freelancer") {
          servicesRes = await axiosClient.get(`/services/my-services`);
          reviewsRes = await axiosClient.get(`/reviews/freelancer/${user.id}`);
        }

        setProfile(profileData);

        const allServices = servicesRes?.data?.services || [];
        setTotalServicesCount(allServices.length); // ✅ postavi ukupan broj usluga
        setServices(getRandomItems(allServices, 3)); // prikazi do 3 random

        const allReviews = reviewsRes?.data?.reviews || [];
        setReviews(getRandomItems(allReviews, 3));

        if (allReviews.length > 0) {
          const avg =
            allReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
            allReviews.length;
          setAverageRating(avg);
        }
      } catch (err) {
        console.error("Greška pri učitavanju profila:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" /> Učitavanje profila...
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="text-center mt-5 text-muted">
        Nema dostupnih podataka o profilu.
      </Container>
    );
  }

  return (
    <Container className="my-5">

      {/* HEADER */}
      <Card className="text-center shadow-sm p-4 mb-4">
        <Card.Img
          variant="top"
          src={avatarImage}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "4px solid #0d6efd",
            objectFit: "cover",
            margin: "0 auto 10px auto",
          }}
        />
        <Card.Body>
        <Card.Title as="h2" className="fw-semibold d-flex align-items-center justify-content-center gap-2">
  {user.role === "company" ? profile.name : user.name}

  {user.role === "company" && Number(profile.badge_verified) === 1 && (
  <span
    style={{
      fontSize: "0.9rem",
      color: "#28a745",
      backgroundColor: "#e6f4ea",
      padding: "4px 10px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    }}
  >
    ✅ Verified
  </span>
)}
</Card.Title>

          <Card.Text className="text-muted mx-auto" style={{ maxWidth: "500px" }}>
            {profile.description || "Ovaj korisnik još nije dodao opis."}
          </Card.Text>

          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button variant="outline-primary" onClick={() => navigate("/my-services")}>
              Pogledaj sve usluge
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* SERVICES */}
      <section className="mb-5">
        <h4 className="fw-semibold mb-3">Neke od usluga</h4>
        {services.length === 0 ? (
          <p className="text-muted fst-italic">Trenutno nema usluga.</p>
        ) : (
          <Row xs={1} md={3} className="g-4">
            {services.map((service) => (
              <Col key={service.id}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title>{service.title}</Card.Title>
                    <Card.Text className="text-muted small">
                      {service.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white fw-semibold text-primary">
                    {service.price} €
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
      
      {/* ✅ RECENZIJE */}
      <section className="mb-5">
        <h4 className="fw-semibold mb-3">Recenzije klijenata:</h4>
        {reviews.length === 0 ? (
          <p className="text-muted fst-italic">Još nema recenzija.</p>
        ) : (
          <Row xs={1} md={3} className="g-4">
            {reviews.map((r) => (
              <Col key={r.id}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Card.Title className="fs-6 mb-0">
                        {r.service?.title}
                      </Card.Title>
                      <span className="text-warning fw-bold">
                        ⭐ {r.rating}
                      </span>
                    </div>
                    <Card.Text className="text-muted fst-italic">
                      “{r.comment || "Bez komentara."}”
                    </Card.Text>
                    <div className="border-top pt-2 small d-flex justify-content-between">
                      <div>
                        👤 <strong>{r.user?.name}</strong>
                        <div className="text-muted">{r.user?.email}</div>
                      </div>
                      <div className="text-end text-secondary">
                        {r.service?.price && `${r.service.price} €`}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* FOOTER */}
      <Card className="bg-light border-0 shadow-sm p-3 text-center">
        <Row>
          <Col>
            {/* ✅ Ovde više nije prikazan broj random usluga */}
            <h4 className="fw-bold text-primary mb-0">{totalServicesCount}</h4>
            <p className="text-muted">Ukupan broj usluga</p>
          </Col>
          <Col>
            <h4 className="fw-bold text-warning mb-0">
              {averageRating ? averageRating.toFixed(1) : "—"}
            </h4>
            <p className="text-muted">Prosečna ocena</p>
          </Col>
          <Col>
            <h4 className="fw-bold text-secondary mb-0">
              {new Date(user.created_at).toLocaleDateString()}
            </h4>
            <p className="text-muted">Član od</p>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default CompanyFreelancerProfilePage;