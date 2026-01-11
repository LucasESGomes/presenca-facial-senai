import { useClasses } from "../../hooks/useClasses";
import useUsers from "../../hooks/useUsers";
import * as RoomsHook from "../../hooks/useRooms";
import { useState, useEffect } from "react";

const ClassForm = () => {
  const { createClass, addTeacher, addRoom } = useClasses();
  const {
    users,
    loadUsers,
    loading: usersLoading,
    error: usersError,
  } = useUsers();
  const resolvedUseRooms = RoomsHook.default || RoomsHook.useRooms;
  const {
    rooms,
    loadRooms,
    loading: roomsLoading,
    error: roomsError,
  } = resolvedUseRooms();

  const [code, setCode] = useState("");
  const [course, setCourse] = useState("");
  const [shift, setShift] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedTeachers, setSelectedTeachers] = useState([]); // array de ids
  const [selectedRooms, setSelectedRooms] = useState([]); // array de ids

  // Carregar usuários e salas
  useEffect(() => {
    loadUsers();
    loadRooms();
  }, [loadUsers, loadRooms]);

  const teachers = users.filter((user) => user.role === "professor");

  if (usersLoading || roomsLoading) return <p>Carregando...</p>;
  if (usersError) return <p>{usersError}</p>;
  if (roomsError) return <p>{roomsError}</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    const newClass = {
      code,
      course,
      shift,
      year,
    };
    // Cria a turma
    const result = await createClass(newClass);
    // Se criou com sucesso e retornou id
    if (
      result &&
      result.success &&
      result.data &&
      (result.data.id || result.data._id)
    ) {
      const classId = result.data.id || result.data._id;
      // Associar professores
      for (const teacherId of selectedTeachers) {
        await addTeacher(classId, teacherId);
      }
      // Associar salas
      for (const roomId of selectedRooms) {
        await addRoom(classId, roomId);
      }
    }
  }

  const toggleTeacher = (id) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleRoom = (id) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Criar Turma</h2>

      <label className="block">Código</label>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded"
      />

      <label className="block">Curso</label>
      <input
        type="text"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded"
      />

      <label className="block">Turno</label>
      <select
        value={shift}
        onChange={(e) => setShift(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Selecione o turno</option>
        <option value="manha">Manhã</option>
        <option value="tarde">Tarde</option>
        <option value="noite">Noite</option>
      </select>

      <label className="block">Período</label>
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded"
      />

      <div>
        <label className="block mb-2 font-semibold">Professores</label>
        <div className="flex flex-wrap gap-2">
          {teachers.map((teacher) => {
            const id = teacher._id || teacher.id;
            const selected = selectedTeachers.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleTeacher(id)}
                className={`px-3 py-1 rounded-full border ${
                  selected
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-800 border-gray-200"
                }`}
              >
                {teacher.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Salas</label>
        <div className="flex flex-wrap gap-2">
          {rooms.map((room) => {
            const id = room._id || room.id;
            const selected = selectedRooms.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleRoom(id)}
                className={`px-3 py-1 rounded-full border ${
                  selected
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-800 border-gray-200"
                }`}
              >
                {room.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Criar Turma
        </button>
      </div>
    </form>
  );
};

export default ClassForm;
