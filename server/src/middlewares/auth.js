import { verifyToken } from "@clerk/clerk-sdk-node";


export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No auth header" });

    const token = authHeader.replace("Bearer ", "");
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });
    console.log("JWT payload:", payload);

    req.userId = payload.sub;
    req.orgId = payload.o?.id;
    req.orgSlug = payload.o?.slg;


    if (!req.orgId) {
      return res.status(403).json({ error: "No organization selected" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
