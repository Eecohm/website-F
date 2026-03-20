/**
 * useRoles.js
 * -----------
 * Fetches role list for an org via GET /api/auth/roles/?org=<slug>
 */
import { useState, useEffect, useRef } from "react";
import publicApi from "@/services/axios/publicApi";

export function useRoles(orgSlug) {
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    const slug = (orgSlug || "").trim();
    if (!slug) {
      setRoles([]);
      setStatus("idle");
      setError("");
      return;
    }

    setStatus("loading");
    setError("");
    setRoles([]);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await publicApi.get(`/auth/roles/?org=${encodeURIComponent(slug)}`);
        setRoles(res.data || []);
        setStatus("ok");
      } catch (err) {
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.org ||
          "Could not load organization. Please check the slug.";
        setError(msg);
        setStatus("error");
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [orgSlug]);

  return { roles, status, error };
}
