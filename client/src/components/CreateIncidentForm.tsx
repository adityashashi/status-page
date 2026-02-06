import { useState } from "react";
import { useApi } from "../lib/api";

type Service = {
    _id: string;
    name: string;
};

export default function CreateIncidentForm({
    services,
    onCreated
}: {
    services: Service[];
    onCreated: () => void;
}) {
    const api = useApi();

    const [title, setTitle] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleService = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id]
        );
    };

    const createIncident = async () => {
        if (!title.trim() || selected.length === 0) return;

        try {
            setLoading(true);

            await api.post("/incidents", {
                title,
                serviceIds: selected,
                status: "INVESTIGATING",
                isMaintenance: false
            });

            setTitle("");
            setSelected([]);
            onCreated();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                border: "1px solid var(--border)",
                background: "var(--panel)",
                padding: 20,
                borderRadius: 12
            }}
        >
            <h3>Create Incident</h3>

            <input
                placeholder="Incident title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 12,
                    background: "#111",
                    border: "1px solid #333",
                    color: "white"
                }}
            />

            <div style={{ marginBottom: 16 }}>
                <strong>Affected Services</strong>

                {services.map(s => (
                    <label
                        key={s._id}
                        style={{ display: "block", marginTop: 6 }}
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(s._id)}
                            onChange={() => toggleService(s._id)}
                            style={{ marginRight: 6 }}
                        />
                        {s.name}
                    </label>
                ))}
            </div>

            <button
                onClick={createIncident}
                disabled={loading}
                style={{
                    padding: "10px 16px",
                    background: "var(--accent)",
                    color: "black",
                    borderRadius: 8,
                    cursor: "pointer"
                }}
            >
                {loading ? "Creating..." : "Create Incident"}
            </button>
        </div>
    );
}
