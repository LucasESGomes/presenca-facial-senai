import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useStudents } from "../hooks/useStudents";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function StudentsPage() {
  const { students, loading, error, loadStudents, deleteStudent } =
    useStudents();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    // Aplicar filtros quando students ou filtros mudam
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(term) ||
          student.registration?.toLowerCase().includes(term) ||
          student.email?.toLowerCase().includes(term)
      );
    }

    if (selectedClass !== "all") {
      filtered = filtered.filter((student) =>
        student.classes?.includes(selectedClass)
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, selectedClass]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este aluno?")) {
      const result = await deleteStudent(id);
      if (result.success) {
        alert("Aluno deletado com sucesso");
      } else {
        alert(result.message || "Erro ao deletar aluno");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/students/${id}/edit`);
  };

  const handleView = (id) => {
    navigate(`/students/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-blue-500 font-semibold text-lg">
            Carregando alunos...
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <div className="font-bold text-lg mb-2">Erro ao carregar alunos</div>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Cabeçalho */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Alunos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todos os alunos do sistema
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/students/new")}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <FaPlus size={18} />
              Novo Aluno
            </button>
            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
              Total: <span className="font-bold">{students.length} alunos</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, matrícula ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Filtro por turma */}
            <div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              >
                <option value="all">Todas as turmas</option>
                <option value="class1">Turma 1</option>
                <option value="class2">Turma 2</option>
                <option value="class3">Turma 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela de alunos */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum aluno encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedClass !== "all"
                ? "Nenhum aluno corresponde aos filtros selecionados."
                : "Não há alunos cadastrados no sistema ainda."}
            </p>
            {(searchTerm || selectedClass !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedClass("all");
                }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Matrícula
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Turmas
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name?.charAt(0) || "A"}
                          </div>
                          <span className="font-medium text-gray-900">
                            {student.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.registration || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.email || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {student.classes && student.classes.length > 0 ? (
                            student.classes.map((className, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                              >
                                {className}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Sem turmas
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            student.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {student.isActive ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleView(student._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Visualizar"
                          >
                            <FaEye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(student._id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Deletar"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rodapé com resumo */}
        <div className="mt-6 text-sm text-gray-600">
          Exibindo <span className="font-bold">{filteredStudents.length}</span>{" "}
          de <span className="font-bold">{students.length}</span> alunos
        </div>
      </div>
    </Layout>
  );
}
