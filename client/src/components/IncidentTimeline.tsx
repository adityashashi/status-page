type Incident = {
    _id: string;
    title: string;
    status: string;
    createdAt: string;
    resolvedAt?: string;
};

export default function IncidentTimeline({
    incidents,
    onResolve
}: {
    incidents: Incident[];
    onResolve: (id: string) => void;
}) {
    if (incidents.length === 0) {
        return <p style={{ opacity: 0.6 }}>No incidents.</p>;
    }

    return (
        <div style={{ marginTop: 20 }}>
            {incidents.map(incident => (
                <div
                    key={incident._id}
                    style={{
                        borderLeft: "2px solid var(--border)",
                        paddingLeft: 12,
                        marginBottom: 16,
                        background: "var(--panel)",
                        padding: "12px 16px",
                        borderRadius: 8,
                    }}
                >
                    <strong>{incident.title}</strong>
                    <div>Status: {incident.status}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                        Created: {new Date(incident.createdAt).toLocaleString()}
                    </div>

                    {incident.status !== "RESOLVED" && (
                        <button
                            onClick={() => onResolve(incident._id)}
                            style={{ marginTop: 6 }}
                        >
                            Mark Resolved
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
