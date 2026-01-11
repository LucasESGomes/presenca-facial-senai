import { useCallback, useState } from "react";
import { usersApi } from "../api/users";

export default function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Exibir os usuários cadastrados
    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await usersApi.getAll();

            if (response.success) {
                setUsers(response.data || []);
            } else {
                setError(response.message || 'Erro ao carregar usuários');
            }
        } catch (err) {
            setError(err.message || 'Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    }, []);


    return {
        // Estado
        users,
        loading,
        error,

        // Ações
        loadUsers
    }
}