import express from "express";
import Incident from "../models/Incident.js";
import { requireAuth } from "../middlewares/auth.js";

export default (io) => {
  const router = express.Router();

  // ---------------- GET ALL INCIDENTS (ADMIN) ----------------
  router.get("/", requireAuth, async (req, res) => {
    const incidents = await Incident.find({
      orgId: req.orgId
    }).sort({ createdAt: -1 });

    res.json(incidents);
  });

  // ---------------- CREATE INCIDENT ----------------
  router.post("/", requireAuth, async (req, res) => {
    const incident = await Incident.create({
      ...req.body,
      orgId: req.orgId,
      orgSlug: req.orgSlug,   // ✅ REQUIRED FOR PUBLIC PAGE
      createdAt: new Date()
    });

    io.to(req.orgId).emit("incident:create", incident);
    res.json(incident);
  });

  // ---------------- UPDATE INCIDENT STATUS ----------------
  router.put("/:id/status", requireAuth, async (req, res) => {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    io.to(req.orgId).emit("incident:update", incident);
    res.json(incident);
  });

  // ---------------- RESOLVE INCIDENT ----------------
  router.put("/:id/resolve", requireAuth, async (req, res) => {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      {
        status: "RESOLVED",
        resolvedAt: new Date()
      },
      { new: true }
    );

    io.to(req.orgId).emit("incident:resolve", incident);
    res.json(incident);
  });

  return router;
};
