import { useState, useCallback } from "react";
import { roomsApi } from "../api/rooms";

export function useRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomsApi.getAll();
      if (response.success) {
        setRooms(response.data || []);
      } else {
        setError(response.message || "Erro ao carregar salas");
      }
    } catch (err) {
      setError(err.message || "Erro ao carregar salas");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rooms,
    loading,
    error,
    loadRooms,
  };
}
/*import { useState } from "react";

export function useRooms() {
    const [rooms, setRooms] = useState([]);

    const addRooms

    return {
        // Estado
        rooms,
        setRooms,

        // Ações
    }
}*/
