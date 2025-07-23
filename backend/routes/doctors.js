import express from "express";
import Doctor from "../models/Doctor.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, address, longitude, latitude } = req.body;

  const doctor = new Doctor({
    name,
    address,
    location: {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    },
  });

  await doctor.save();
  res.json(doctor);
});


router.get("/nearby", async (req, res) => {
  try {
    const longitude = parseFloat(req.query.longitude);
    const latitude = parseFloat(req.query.latitude);
    const radius = parseFloat(req.query.radius) * 1000; // km to meters

    if (!longitude || !latitude || !radius) {
      return res.status(400).json({ error: "Missing longitude, latitude or radius" });
    }

    const doctors = await Doctor.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        },
      },
    });

    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
