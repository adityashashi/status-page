type Service = {
    _id: string;
    name: string;
    status: string;
};

const statusColor: Record<string, string> = {
    OPERATIONAL: "#16a34a",
    DEGRADED: "#ca8a04",
    PARTIAL_OUTAGE: "#ea580c",
    MAJOR_OUTAGE: "#dc2626"
};

export default function ServiceList({ services }: { services: Service[] }) {
    if (services.length === 0) {
        return <p style={{ opacity: 0.7 }}>No services yet.</p>;
    }

    return (
        <div style={{ marginTop: 20 }}>
            {services.map(service => (
                <div
                    key={service._id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        border: "1px solid #2a2a2a",
                        borderRadius: 6,
                        marginBottom: 8
                    }}
                >
                    <span>{service.name}</span>
                    <span style={{ color: statusColor[service.status] }}>
                        {service.status}
                    </span>
                </div>
            ))}
        </div>
    );
}
