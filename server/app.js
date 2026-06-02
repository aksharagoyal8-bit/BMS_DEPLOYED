require('dotenv').config(); 
const express = require('express');
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoutes');
const movieRoute = require("./routes/movieRoutes");
const theatreRoutes = require("./routes/theatreRoutes");
const showRoute = require("./routes/showRoutes");
const bookRoute = require("./routes/bookingRoutes");

const app = express();
app.set('trust proxy', 1); // Required for Render / any reverse proxy
const PORT = process.env.PORT || 8080;

connectDB(process.env.DB_URL);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
        ],
      },
    },
  })
);
app.use(express.json());
app.use(cors());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, Please try again later after 15 minutes."
});


app.use("/api/", apiLimiter);
app.use("/api/users", userRoute);
app.use("/api/movie", movieRoute);
app.use("/api/theatre", theatreRoutes);
app.use("/api/show", showRoute);
app.use("/api/booking", bookRoute);


app.use(express.static(path.join(__dirname, 'build')));
app.get('*path', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});