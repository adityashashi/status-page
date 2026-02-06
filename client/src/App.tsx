import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  OrganizationSwitcher,
  useOrganization
} from "@clerk/clerk-react";

import CreateIncidentForm from "./components/CreateIncidentForm";
import IncidentTimeline from "./components/IncidentTimeline";
import { useApi } from "./lib/api";

const socket = io("http://localhost:5000");

type Service = {
  _id: string;
  name: string;
  status: string;
};

type Incident = {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
};

const STATUSES = [
  "OPERATIONAL",
  "DEGRADED",
  "PARTIAL_OUTAGE",
  "MAJOR_OUTAGE"
];

/* ---------------- UI HELPERS ---------------- */

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    OPERATIONAL: "var(--green)",
    DEGRADED: "var(--yellow)",
    PARTIAL_OUTAGE: "var(--orange)",
    MAJOR_OUTAGE: "var(--red)"
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        color: colorMap[status],
        border: `1px solid ${colorMap[status]}33`
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function App() {
  const { organization } = useOrganization();
  const api = useApi();

  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("OPERATIONAL");
  const [loading, setLoading] = useState(false);

  const ORG_ID = organization?.id;

  /* ---------------- SERVICES ---------------- */

  const fetchServices = async () => {
    if (!ORG_ID) return;
    const res = await api.get("/services");
    setServices(res.data);
  };

  const createService = async () => {
    if (!name.trim() || !ORG_ID) return;

    setLoading(true);
    try {
      await api.post("/services", { name, status });
      await fetchServices(); // safety net
      setName("");
      setStatus("OPERATIONAL");
    } finally {
      setLoading(false);
    }
  };

  const upsertService = (service: Service) => {
    setServices(prev =>
      [...prev.filter(s => s._id !== service._id), service]
    );
  };

  /* ---------------- INCIDENTS ---------------- */

  const fetchIncidents = async () => {
    if (!ORG_ID) return;
    const res = await api.get("/incidents");
    setIncidents(res.data);
  };

  const resolveIncident = async (id: string) => {
    if (!ORG_ID) return;
    await api.put(`/incidents/${id}/resolve`);
  };

  /* ---------------- SOCKETS ---------------- */

  useEffect(() => {
    if (!ORG_ID) return;

    socket.emit("join-org", ORG_ID);

    socket.on("service:create", upsertService);
    socket.on("service:update", upsertService);

    socket.on("incident:create", fetchIncidents);
    socket.on("incident:update", fetchIncidents);
    socket.on("incident:resolve", fetchIncidents);

    fetchServices();
    fetchIncidents();

    return () => {
      socket.off("service:create", upsertService);
      socket.off("service:update", upsertService);
      socket.off("incident:create", fetchIncidents);
      socket.off("incident:update", fetchIncidents);
      socket.off("incident:resolve", fetchIncidents);
    };
  }, [ORG_ID]);

  /* ---------------- LOADING ---------------- */

  if (!organization) {
    return (
      <div style={{ padding: 40 }}>
        <p>Select or create an organization to continue.</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div style={{ maxWidth: 760, margin: "60px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Status Page</h1>
        <OrganizationSwitcher hidePersonal />
      </div>

      {/* CREATE SERVICE */}
      <div
        style={{
          border: "1px solid var(--border)",
          background: "var(--panel)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 32
        }}
      >
        <h3>Add Service</h3>

        <input
          placeholder="Service name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button onClick={createService} disabled={loading}>
          {loading ? "Creating..." : "Create Service"}
        </button>
      </div>

      {/* SERVICES */}
      {services.length === 0 && (
        <p style={{ opacity: 0.7 }}>No services yet.</p>
      )}

      {services.map(service => (
        <div
          key={service._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            border: "1px solid var(--border)",
            background: "var(--panel)",
            borderRadius: 8,
            marginBottom: 8
          }}
        >
          <strong>{service.name}</strong>
          <StatusBadge status={service.status} />
        </div>
      ))}

      {/* INCIDENTS */}
      <div
        style={{
          height: 1,
          background: "var(--border)",
          margin: "48px 0"
        }}
      />

      <CreateIncidentForm
        services={services}
        onCreated={fetchIncidents}
      />

      <h2 style={{ marginTop: 30 }}>Incidents</h2>

      <IncidentTimeline
        incidents={incidents}
        onResolve={resolveIncident}
      />
    </div>
  );
}
