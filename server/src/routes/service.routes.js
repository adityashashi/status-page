import express from "express";
import Service from "../models/Service.js";
import { requireAuth } from "../middlewares/auth.js";

export default (io) => {
  const router = express.Router();

  router.get("/", requireAuth, async (req, res) => {
    res.json(await Service.find({ orgId: req.orgId }));
  });

  router.post("/", requireAuth, async (req, res) => {
    const service = await Service.create({
      name: req.body.name,
      status: req.body.status,
      orgId: req.orgId,
      orgSlug: req.orgSlug
    });

    io.to(req.orgId).emit("service:create", service);

    return res.json(service);
  });


  return router;
};
