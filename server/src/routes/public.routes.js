import express from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import Service from "../models/Service.js";
import Incident from "../models/Incident.js";

const router = express.Router();

// ✅ Initialize Clerk correctly
const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
});

router.get("/:orgSlug", async (req, res) => {
    try {
        const { orgSlug } = req.params;

        // 🔍 Find organization by slug
        const orgs = await clerk.organizations.getOrganizationList();

        const org = orgs.data.find(o => o.slug === orgSlug);
        if (!org) {
            return res.status(404).json({ error: "Organization not found" });
        }

        const orgId = org.id;

        // ✅ Fetch data
        const services = await Service.find({ orgId });

        const activeIncidents = await Incident.find({
            orgId,
            status: { $ne: "RESOLVED" }
        }).sort({ createdAt: -1 });

        const recentIncidents = await Incident.find({ orgId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            services,
            activeIncidents,
            recentIncidents
        });
    } catch (err) {
        console.error("Public status error:", err);
        res.status(500).json({ error: "Internal error" });
    }
});

export default router;
