import axios from "axios";
import { useAuth, useOrganization } from "@clerk/clerk-react";

export const useApi = () => {
    const { getToken } = useAuth();
    const { organization } = useOrganization();

    const api = axios.create({
        baseURL: "https://status-page-2-neqa.onrender.com"
    });

    api.interceptors.request.use(async config => {
        if (!organization) {
            throw new Error("No active organization");
        }

        const token = await getToken({
            organizationId: organization.id
        });

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    return api;
};
