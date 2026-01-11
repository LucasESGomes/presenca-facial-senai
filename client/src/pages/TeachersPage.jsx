import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
} from "react-icons/fa";
import { useClasses } from "../hooks/useClasses";

export default function TeachersPage() {
  const navigate = useNavigate();
  const { classes, loadClasses } = useClasses();

  // Dados fictícios de professores (simulando dados do banco de dados)
  const [teachers, setTeachers] = useState([
    {
      _id: "693d75775858dd95e811d488",
      name: "Bruno Messias Aguiar",
      email: "brunomessias@gmail.com",
      role: "professor",
      isActive: true,
      createdAt: "2025-12-13T14:17:27.346Z",
      updatedAt: "2025-12-13T14:17:27.346Z",
      phone: "(11) 99876-5432",
      department: "Tecnologia da Informação",
    },
    {
      _id: "695ff1122da606b8885f7e9c",
      name: "Sillas Bastianelli Pinto",
      email: "sillasbastianelli@gmail.com",
      role: "professor",
      isActive: true,
      createdAt: "2026-01-08T18:01:54.969Z",
      updatedAt: "2026-01-08T18:01:54.969Z",
      phone: "(11) 98765-4321",
      department: "Tecnologia da Informação",
    },
    {
      _id: "694f88334d3e4e7f123abc45",
      name: "Fernanda Silva Santos",
      email: "fernanda.silva@senai.com",
      role: "professor",
      isActive: true,
      createdAt: "2025-11-20T10:30:00.000Z",
      updatedAt: "2025-11-20T10:30:00.000Z",
      phone: "(11) 97654-3210",
      department: "Tecnologia da Informação",
    },
    {
      _id: "694f88334d3e4e7f123abc46",
      name: "Carlos Roberto Oliveira",
      email: "carlos.oliveira@senai.com",
      role: "professor",
      isActive: false,
      createdAt: "2025-10-15T14:45:30.000Z",
      updatedAt: "2025-10-15T14:45:30.000Z",
      phone: "(11) 98543-2109",
      department: "Infraestrutura",
    },
  ]);

  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carregar turmas do sistema
    const loadData = async () => {
      setLoading(true);
      await loadClasses();
      setLoading(false);
    };
    loadData();
  }, [loadClasses]);

  useEffect(() => {
    let filtered = [...teachers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (teacher) =>
          teacher.name?.toLowerCase().includes(term) ||
          teacher.email?.toLowerCase().includes(term)
      );
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (teacher) => teacher.department === selectedDepartment
      );
    }

    if (selectedStatus !== "all") {
      const isActive = selectedStatus === "active";
      filtered = filtered.filter((teacher) => teacher.isActive === isActive);
    }

    setFilteredTeachers(filtered);
  }, [teachers, searchTerm, selectedDepartment, selectedStatus]);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja deletar este professor?")) {
      setTeachers(teachers.filter((t) => t._id !== id));
      alert("Professor deletado com sucesso");
    }
  };

  const handleEdit = (id) => {
    navigate(`/teachers/${id}/edit`);
  };

  const handleView = (id) => {
    navigate(`/teachers/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 font-semibold text-lg">
            Carregando professores...
          </div>
        </div>
      </Layout>
    );
  }

  // Função para obter as turmas de um professor
  const getTeacherClasses = (teacherId) => {
    return classes.filter((cls) =>
      cls.teachers?.some((t) => t._id === teacherId || t === teacherId)
    );
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Cabeçalho */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Professores</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todos os professores do sistema
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/teachers/new")}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <FaPlus size={18} />
              Novo Professor
            </button>
            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
              Total:{" "}
              <span className="font-bold">{teachers.length} professores</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter size={18} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Filtro por departamento */}
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              >
                <option value="all">Todos os departamentos</option>
                <option value="Tecnologia da Informação">
                  Tecnologia da Informação
                </option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Gestão">Gestão</option>
              </select>
            </div>

            {/* Filtro por status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela de professores */}
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum professor encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ||
              selectedDepartment !== "all" ||
              selectedStatus !== "all"
                ? "Nenhum professor corresponde aos filtros selecionados."
                : "Não há professores cadastrados no sistema ainda."}
            </p>
            {(searchTerm ||
              selectedDepartment !== "all" ||
              selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("all");
                  setSelectedStatus("all");
                }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Header do card */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {teacher.name?.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {teacher.name}
                        </h2>
                        <p className="text-red-100 text-sm">
                          {teacher.department}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        teacher.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {teacher.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>

                {/* Corpo do card */}
                <div className="p-6 space-y-4">
                  {/* Email e Telefone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {teacher.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Telefone
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {teacher.phone}
                      </p>
                    </div>
                  </div>

                  {/* Turmas */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Turmas que atua
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {getTeacherClasses(teacher._id).length > 0 ? (
                        getTeacherClasses(teacher._id).map((cls) => (
                          <span
                            key={cls._id}
                            className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium border border-red-200"
                          >
                            {cls.code} - {cls.course}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">
                          Nenhuma turma cadastrada
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Data de cadastro */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Cadastrado em{" "}
                      {new Date(teacher.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(teacher._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(teacher._id)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {getTeacherClasses(teacher._id).length} turma
                    {getTeacherClasses(teacher._id).length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rodapé com resumo */}
        <div className="mt-6 text-sm text-gray-600">
          Exibindo <span className="font-bold">{filteredTeachers.length}</span>{" "}
          de <span className="font-bold">{teachers.length}</span> professores
        </div>
      </div>
    </Layout>
  );
}
