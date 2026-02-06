import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

export default function PublicStatus() {
    const { orgSlug } = useParams();
    const [services, setServices] = useState<Service[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        if (!orgSlug) return;

        axios
            .get(`http://localhost:5000/api/public/${orgSlug}`)
            .then(res => {
                setServices(res.data.services);
                setIncidents(res.data.incidents);
            });
    }, [orgSlug]);

    const activeIncidents = incidents.filter(
        i => !i.resolvedAt
    );

    return (
        <div style={{ maxWidth: 760, margin: "60px auto", padding: "0 16px" }}>
            <h1>Status</h1>

            {/* ---------------- SERVICES ---------------- */}
            <h2 style={{ marginTop: 24 }}>Services</h2>

            {services.length === 0 && (
                <p style={{ opacity: 0.7 }}>No services configured.</p>
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
                    <span>{service.status.replace("_", " ")}</span>
                </div>
            ))}

            {/* ---------------- ACTIVE INCIDENTS ---------------- */}
            <h2 style={{ marginTop: 48 }}>Active Incidents</h2>

            {activeIncidents.length === 0 && (
                <p style={{ opacity: 0.7 }}>No active incidents.</p>
            )}

            {activeIncidents.map(incident => (
                <div
                    key={incident._id}
                    style={{
                        padding: 16,
                        borderLeft: "4px solid var(--red)",
                        background: "var(--panel)",
                        borderRadius: 8,
                        marginBottom: 16
                    }}
                >
                    <strong>{incident.title}</strong>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                        Started at{" "}
                        {new Date(incident.createdAt).toLocaleString()}
                    </div>
                </div>
            ))}

            {/* ---------------- INCIDENT TIMELINE ---------------- */}
            <h2 style={{ marginTop: 48 }}>Incident History</h2>

            {incidents.length === 0 && (
                <p style={{ opacity: 0.7 }}>No incidents reported.</p>
            )}

            {incidents.map(incident => (
                <div
                    key={incident._id}
                    style={{
                        padding: "12px 16px",
                        borderLeft: "2px solid var(--border)",
                        marginBottom: 16
                    }}
                >
                    <strong>{incident.title}</strong>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                        {incident.resolvedAt
                            ? `Resolved at ${new Date(
                                incident.resolvedAt
                            ).toLocaleString()}`
                            : `Started at ${new Date(
                                incident.createdAt
                            ).toLocaleString()}`}
                    </div>
                </div>
            ))}
        </div>
    );
}
