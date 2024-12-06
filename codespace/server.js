const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const clientId = "f4adc5183a3019206b61b9885a1e78d";
const clientSecret =
  "79f0cccea14e8e1051e3e65ceec0b8e1d2930d8658996375ac4b288eb442cd27";

app.post("/compile", async (req, res) => {
  const { code } = req.body; // Get the code from the request body

  const body = {
    script: code,
    language: "cpp", // Set language to C++
    versionIndex: "3",
    clientId: clientId,
    clientSecret: clientSecret,
  };

  try {
    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    res.json(response.data); // Send the output of the compilation back to the client
  } catch (error) {
    console.error("Error compiling code:", error);
    res.status(500).json({ error: "Failed to compile code" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
