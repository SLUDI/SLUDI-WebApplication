import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch deepfake detection logs
 */
export const fetchDeepfakeLogs = async ({ page = 0, size = 20, deepfakeOnly = false }) => {
    const response = await axiosInstance.get(endpoints.DEEPFAKE_LOGS, {
        params: { page, size, deepfakeOnly },
    });
    return response.data;
};

/**
 * Fetch deepfake detection statistics
 */
export const fetchDeepfakeStats = async () => {
    const response = await axiosInstance.get(endpoints.DEEPFAKE_STATS);
    return response.data;
};

/**
 * Hook for fetching deepfake logs
 */
export const useDeepfakeLogs = (page = 0, size = 20, deepfakeOnly = false) => {
    return useQuery({
        queryKey: ["deepfakeLogs", page, size, deepfakeOnly],
        queryFn: () => fetchDeepfakeLogs({ page, size, deepfakeOnly }),
        staleTime: 30000, // 30 seconds
    });
};

/**
 * Hook for fetching deepfake stats
 */
export const useDeepfakeStats = () => {
    return useQuery({
        queryKey: ["deepfakeStats"],
        queryFn: fetchDeepfakeStats,
        staleTime: 60000, // 1 minute
    });
};
