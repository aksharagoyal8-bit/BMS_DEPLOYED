import { useEffect, useState,useRef } from "react";
import { useSelector } from "react-redux";
import { getShowById } from "../api/show";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { message, Card, Row, Col, Button } from "antd";
import moment from "moment";
import { bookShow, makePayment } from "../api/bookings";

const BookShow = () => {
  const { user } = useSelector((state) => state.user);
  const [show, setShow] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 
    const hasConfirmed = useRef(false);

  const getData = async () => {
    try {
      const response = await getShowById({ showId: params.id });
      if (response.success) {
        setShow(response.data);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // ✅ NEW: Runs when Stripe redirects back here after payment
  const confirmBookingAfterPayment = async () => {
    const sessionId = searchParams.get("session_id");
    const seats = searchParams.get("seats");
    const userId = searchParams.get("userId");

    if (!sessionId || !seats || !userId) return; // not a redirect, normal page load
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;
    try {
      const resp = await bookShow({
        show: params.id,
        transactionId: sessionId,
        seats: seats.split(",").map(Number),
        user: userId,
      });

      if (resp.success) {
        message.success("🎉 Booking confirmed! Enjoy your movie.");
        navigate("/profile");
      } else {
        message.error( "Booking failed.");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

 const getSeats = () => {
    let columns = 12;
    let totalSeats = 120;
    let rows = totalSeats / columns; // 10
    return (
      <div
        className="d-flex flex-column align-items-center"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">
            Screen this side, you will be watching in this direction
          </p>
          <div className="screen-div"></div>
        </div>
        <ul className="seat-ul justify-content-center">
          {Array.from(Array(rows).keys()).map((row) => {
            return Array.from(Array(columns).keys()).map((column) => {
              let seatNumber = row * columns + column + 1;

              let seatClass = "seat-btn";
              if (selectedSeats.includes(seatNumber)) {
                seatClass += " selected";
              }
              if (show.bookedSeats.includes(seatNumber)) {
                seatClass += " booked";
              }
              if (seatNumber <= totalSeats)
                return (
                  <li>
                    <button
                      className={seatClass}
                      onClick={() => {
                        if (selectedSeats.includes(seatNumber)) {
                          setSelectedSeats(
                            selectedSeats.filter(
                              (curSeatNumber) => curSeatNumber !== seatNumber
                            )
                          );
                        } else {
                          setSelectedSeats([...selectedSeats, seatNumber]);
                        }
                      }}
                    >
                      {seatNumber}
                    </button>
                  </li>
                );
            });
          })}
        </ul>

        <div className="d-flex bottom-card justify-content-between w-100 max-width-600 mx-auto mb-25px mt-3">
          <div className="flex-1">
            Selected Seats: <span>{selectedSeats.join(", ")}</span>
          </div>
          <div className="flex-shrink-0 ms-3">
            Total Price:{" "}
            <span>Rs. {selectedSeats.length * show.ticketPrice}</span>
          </div>
        </div>
      </div>
    );
  };

  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      message.warning("Please select at least one seat.");
      return;
    }
    setLoading(true);
    try {
      const response = await makePayment({
        showId: params.id,
        seats: selectedSeats,
        userId: user._id,
        amount: selectedSeats.length * show.ticketPrice,
      });

      if (response.success) {
        window.location.href = response.url;
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    confirmBookingAfterPayment(); 
  }, []);

  return (
    <>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div className="movie-title-details">
                  <h1>{show.movie.movieName}</h1>
                  <p>Theatre: {show.theatre.name}, {show.theatre.address}</p>
                </div>
              }
              extra={
                <div className="show-name py-3">
                  <h3><span>Show Name:</span> {show.name}</h3>
                  <h3>
                    <span>Date & Time: </span>
                    {moment(show.date).format("MMM Do YYYY")} at{" "}
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </h3>
                  <h3><span>Ticket Price:</span> Rs. {show.ticketPrice}/-</h3>
                  <h3>
                    <span>Total Seats:</span> {show.totalSeats}
                    <span> &nbsp;|&nbsp; Available Seats:</span>{" "}
                    {show.totalSeats - show.bookedSeats.length}
                  </h3>
                </div>
              }
              style={{ width: "100%" }}
            >
              {getSeats()}
              {selectedSeats.length > 0 && (
                <div className="max-width-600 mx-auto">
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    block
                    loading={loading}
                    onClick={handlePayment}
                  >
                    Pay Now
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default BookShow;