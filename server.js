const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({
    message: "Nexora backend is working!"
  });
});

app.listen(3000, () => {
  console.log("Nexora backend running on http://localhost:3000");
});