import express from "express";
import axios from "axios";
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
    let longitude, latitude;

    const radius = parseFloat(req.query.radius) * 1000;

    if (req.query.placeName) {
      const placeName = req.query.placeName;
      const mapboxToken = process.env.VITE_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN;

      const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        placeName
      )}.json?access_token=${mapboxToken}`;

      const geoRes = await axios.get(geoUrl);

      if (!geoRes.data.features || geoRes.data.features.length === 0) {
        return res.status(400).json({ error: "Could not geocode place name" });
      }

      [longitude, latitude] = geoRes.data.features[0].center;
    } else {
      longitude = parseFloat(req.query.longitude);
      latitude = parseFloat(req.query.latitude);
    }

    if (isNaN(longitude) || isNaN(latitude) || isNaN(radius)) {
      return res
        .status(400)
        .json({ error: "Missing or invalid longitude, latitude, or radius" });
    }

    const query = {
      $and: [
        {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              $maxDistance: radius,
            },
          },
        },
      ],
    };

    if (req.query.placeName) {
      query.$and.push({
        address: { $regex: req.query.placeName, $options: "i" },
      });
    }

    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
