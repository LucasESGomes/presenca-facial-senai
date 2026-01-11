import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaPhone,
  FaBuilding,
} from "react-icons/fa";
import { useClasses } from "../../hooks/useClasses";

export default function TeacherForm() {
  const navigate = useNavigate();
  const { loadClasses } = useClasses();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    isActive: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const departments = [
    "Tecnologia da Informação",
    "Infraestrutura",
    "Gestão",
    "Administração",
  ];

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validação
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim()
      ) {
        setError("Preenchimento dos campos obrigatórios é necessário");
        setSubmitting(false);
        return;
      }

      // Simular envio
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setTimeout(() => {
        navigate("/teachers");
      }, 2000);
    } catch (err) {
      setError(err.message || "Erro ao criar professor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/teachers")}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium mb-4 transition-colors"
        >
          <FaArrowLeft size={18} />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Cadastrar Novo Professor
        </h1>
        <p className="text-gray-600 mt-2">
          Preencha os dados abaixo para criar um novo professor no sistema
        </p>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <FaCheck size={20} />
          Professor criado com sucesso! Redirecionando...
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <FaTimes size={20} />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Informações Pessoais */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <h2 className="text-xl font-bold text-white">
              Informações Pessoais
            </h2>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
                  placeholder="Ex: João Silva"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
                  placeholder="Ex: joao@email.com"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <FaPhone size={16} className="text-red-600" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
                  placeholder="Ex: (11) 98765-4321"
                />
              </div>

              {/* Departamento */}
              <div>
                <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <FaBuilding size={16} className="text-red-600" />
                  Departamento *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
                >
                  <option value="">Selecione um departamento</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="flex-1 text-gray-700 font-medium cursor-pointer"
              >
                Professor Ativo
              </label>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  formData.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {formData.isActive ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/teachers")}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Criando...
              </>
            ) : (
              <>
                <FaCheck size={18} />
                Criar Professor
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
