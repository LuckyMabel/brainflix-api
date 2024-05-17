const express = require("express");
const cors = require("cors");
const app = express();
const videosRouter = require('./routes/videos');
require("dotenv").config();

app.use(express.static("public"));

const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
    origin: CORS_ORIGIN,
  }));

app.use(express.json());
app.use('/videos', videosRouter);

app.get("/", function (req, res) {
  res.send("Brainflix home page is running on route `/`");
});

app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);
