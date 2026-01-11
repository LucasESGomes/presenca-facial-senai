import { useClasses } from "../../hooks/useClasses";
import { useState } from "react";

const ClassForm = () => {
  const { createClass } = useClasses();

  const [code, setCode] = useState("");
  const [course, setCourse] = useState("");
  const [shift, setShift] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dados de exemplo para professores e salas (você pode substituir por dados da API)
  const teachersList = [
    { id: 1, name: "Carlos Silva", email: "carlos@senai.com" },
    { id: 2, name: "Ana Pereira", email: "ana@senai.com" },
    { id: 3, name: "Roberto Santos", email: "roberto@senai.com" },
    { id: 4, name: "Mariana Costa", email: "mariana@senai.com" },
    { id: 5, name: "João Mendes", email: "joao@senai.com" },
  ];

  const roomsList = [
    { id: 1, name: "Lab 101", location: "Bloco A - 1º Andar", capacity: 25 },
    { id: 2, name: "Lab 102", location: "Bloco A - 1º Andar", capacity: 30 },
    { id: 3, name: "Sala 201", location: "Bloco B - 2º Andar", capacity: 20 },
    { id: 4, name: "Sala 202", location: "Bloco B - 2º Andar", capacity: 25 },
    { id: 5, name: "Auditório 1", location: "Bloco Central", capacity: 50 },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const newClass = {
      code,
      course,
      shift,
      year,
      teachers: selectedTeachers,
      rooms: selectedRooms,
    };

    await createClass(newClass);
    setIsSubmitting(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Cabeçalho do formulário */}
        <div className="bg-red-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Criar Nova Turma</h2>
          <p className="text-red-100 mt-2">
            Preencha os dados abaixo para cadastrar uma nova turma
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coluna 1 */}
            <div className="space-y-6">
              {/* Código */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Código da Turma *
                  </span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Ex: TURMA-2024-A"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Identificador único da turma
                </p>
              </div>

              {/* Curso */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Curso *
                  </span>
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Ex: Desenvolvimento de Sistemas"
                />
              </div>

              {/* Turno */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Turno *
                  </span>
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-white"
                >
                  <option value="">Selecione o turno</option>
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                  <option value="noite">Noite</option>
                </select>
              </div>
            </div>

            {/* Coluna 2 */}
            <div className="space-y-6">
              {/* Ano/Período */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ano/Período *
                  </span>
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  min="2000"
                  max="2100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Ex: 2024"
                />
              </div>

              {/* Professores (Select Multiplo) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Professores
                  </span>
                </label>
                <select
                  multiple
                  value={selectedTeachers}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    const selectedTeachersData = teachersList.filter(
                      (teacher) => values.includes(teacher.id.toString())
                    );
                    setSelectedTeachers(selectedTeachersData);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-white min-h-[120px]"
                >
                  {teachersList.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
                <div className="flex items-center mt-2">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">
                    Mantenha Ctrl (ou Cmd) pressionado para selecionar múltiplos
                    professores
                  </p>
                </div>

                {/* Professores selecionados */}
                {selectedTeachers.length > 0 && (
                  <div className="mt-3">
                    <p className="text-gray-700 text-sm font-medium mb-2">
                      Professores selecionados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeachers.map((teacher) => (
                        <span
                          key={teacher.id}
                          className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {teacher.name}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTeachers((prev) =>
                                prev.filter((t) => t.id !== teacher.id)
                              );
                            }}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Salas (Select Multiplo) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Salas
                  </span>
                </label>
                <select
                  multiple
                  value={selectedRooms.map((room) => room.id.toString())}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    const selectedRoomsData = roomsList.filter((room) =>
                      values.includes(room.id.toString())
                    );
                    setSelectedRooms(selectedRoomsData);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-white min-h-[120px]"
                >
                  {roomsList.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {room.location} ({room.capacity} lugares)
                    </option>
                  ))}
                </select>
                <div className="flex items-center mt-2">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">
                    Mantenha Ctrl (ou Cmd) pressionado para selecionar múltiplas
                    salas
                  </p>
                </div>

                {/* Salas selecionadas */}
                {selectedRooms.length > 0 && (
                  <div className="mt-3">
                    <p className="text-gray-700 text-sm font-medium mb-2">
                      Salas selecionadas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRooms.map((room) => (
                        <span
                          key={room.id}
                          className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {room.name}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRooms((prev) =>
                                prev.filter((r) => r.id !== room.id)
                              );
                            }}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => {
                setCode("");
                setCourse("");
                setShift("");
                setYear(new Date().getFullYear());
                setSelectedTeachers([]);
                setSelectedRooms([]);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Limpar Formulário
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Cadastrando...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Criar Turma
                </>
              )}
            </button>
          </div>

          {/* Informações adicionais */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-gray-700 font-medium mb-1">
                  Informações importantes
                </p>
                <p className="text-gray-600 text-sm">
                  Todos os campos marcados com * são obrigatórios. Após o
                  cadastro, a turma estará disponível imediatamente no sistema e
                  poderá ser gerenciada através do dashboard. Professores e
                  salas podem ser adicionados posteriormente se necessário.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
