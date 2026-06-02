const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const bookingModel = require("../models/bookingModel");
const showModel = require("../models/showModel");
const EmailHelper = require("../utils/emailHelper");

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { showId, seats, userId, amount } = req.body;

    const rawClientUrl =
      req.headers.origin ||
      req.headers.referer ||
      process.env.CLIENT_URL ||
      "";
    const clientUrl = String(rawClientUrl).replace(/\/$/, "");

    if (!clientUrl) {
      return res.status(400).send({
        success: false,
        message:
          "Unable to determine client URL. Set CLIENT_URL or send Origin/Referer header.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Movie Ticket Booking",
              description: `${seats.length} seat(s): ${seats.join(", ")}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl}/book-show/${showId}?seats=${seats.join(",")}&userId=${userId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/`,
    });

    res.send({
      success: true,
      message: "Checkout session created",
      url: session.url,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

router.post("/book-show", authMiddleware, async (req, res) => {
  try {
    const { show, transactionId, seats } = req.body;
    const user = req.user.userId;

    const newBooking = new bookingModel({ show, transactionId, seats, user });
    await newBooking.save();

    const showData = await showModel.findById(show).populate("movie");
    const updatedBookedSeats = [...showData.bookedSeats, ...seats];
    showData.bookedSeats = updatedBookedSeats;
    await showData.save();

    // ✅ FIXED: Single populate with array for both movie and theatre
    const populatedBooking = await bookingModel
      .findById(newBooking._id)
      .populate("user")
      .populate({
        path: "show",
        populate: [
          { path: "movie", model: "movies" },
          { path: "theatre", model: "theatres" },
        ],
      });

    // ✅ FIXED: Added safety check before sending email
    if (
      populatedBooking.show &&
      populatedBooking.show.movie &&
      populatedBooking.show.theatre
    ) {
      await EmailHelper(
        "ticketTemplate.html",
        populatedBooking.user.email,
        {
          name: populatedBooking.user.name,
          movie: populatedBooking.show.movie.movieName,
          theatre: populatedBooking.show.theatre.name,
          date: populatedBooking.show.date,
          time: populatedBooking.show.time,
          seats: populatedBooking.seats,
          amount: populatedBooking.seats.length * populatedBooking.show.ticketPrice,
          transactionId: populatedBooking.transactionId,
        },
        "Booking Confirmation"
      );
    } else {
      console.error("Populate failed — show/movie/theatre missing:", populatedBooking);
    }

    res.send({
      success: true,
      message: "Show Booked",
      data: populatedBooking,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

router.get("/all-booking-by-user", authMiddleware, async (req, res) => {
  try {
    // ✅ FIXED: Single populate with array for both movie and theatre
    const bookings = await bookingModel
      .find({ user: req.user.userId })
      .populate("user")
      .populate({
        path: "show",
        populate: [
          { path: "movie", model: "movies" },
          { path: "theatre", model: "theatres" },
        ],
      });

    res.send({
      success: true,
      message: "All bookings have been fetched",
      data: bookings,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;