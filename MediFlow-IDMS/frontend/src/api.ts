
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ATTACH JWT TOKEN TO EVERY REQUEST
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mediflow-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(
        "MEDIFLOW: No authentication token found for:",
        config.url
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// HANDLE API ERRORS WITHOUT AUTOMATICALLY DELETING THE TOKEN
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("MEDIFLOW API ERROR:", {
      url: error.config?.url,
      status: error.response?.status,
      response: error.response?.data,
    });

    return Promise.reject(error);
  }
);

// CSV DOWNLOAD
export const downloadCsv = (
  filename: string,
  rows: Record<string, unknown>[]
) => {
  if (!rows.length) return;

  const keys = Object.keys(rows[0]);

  const csv = [
    keys.join(","),
    ...rows.map((row) =>
      keys
        .map(
          (key) =>
            `"${String(row[key] ?? "").replaceAll('"', '""')}"`
        )
        .join(",")
    ),
  ].join("\n");

  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" })
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};
