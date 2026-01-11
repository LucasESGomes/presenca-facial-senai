import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useStudents } from "../hooks/useStudents";
import { studentsApi } from "../api/students";
import { FaArrowLeft, FaCamera, FaCheck, FaTimes } from "react-icons/fa";

export default function StudentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateStudent, encodeFace, validateImage } = useStudents();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registration: "",
    isActive: true,
    classes: [],
  });

  const [faceImage, setFaceImage] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [faceProcessing, setFaceProcessing] = useState(false);
  const [faceEmbedding, setFaceEmbedding] = useState(null);

  // Carregar dados do aluno
  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoadingStudent(true);
        const response = await studentsApi.getAll();
        if (response.success) {
          const student = response.data?.find((s) => s._id === id);
          if (student) {
            setFormData({
              name: student.name || "",
              email: student.email || "",
              registration: student.registration || "",
              isActive: student.isActive !== false,
              classes: student.classes || [],
            });
          } else {
            setError("Aluno não encontrado");
          }
        }
      } catch (err) {
        setError("Erro ao carregar dados do aluno");
      } finally {
        setLoadingStudent(false);
      }
    };

    loadStudent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar imagem
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFacePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Processar embedding
    setFaceImage(file);
    setFaceProcessing(true);
    setError(null);

    try {
      const result = await encodeFace(file);
      setFaceEmbedding(result.data);
    } catch (err) {
      setError("Erro ao processar imagem facial");
      setFaceImage(null);
      setFacePreview(null);
    } finally {
      setFaceProcessing(false);
    }
  };

  const handleClassToggle = (classCode) => {
    setFormData((prev) => ({
      ...prev,
      classes: prev.classes.includes(classCode)
        ? prev.classes.filter((c) => c !== classCode)
        : [...prev.classes, classCode],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validar campos obrigatórios
      if (
        !formData.name.trim() ||
        !formData.registration.trim() ||
        !formData.email.trim()
      ) {
        setError("Preenchimento dos campos obrigatórios é necessário");
        setSubmitting(false);
        return;
      }

      const updateData = {
        ...formData,
      };

      // Se nova imagem foi enviada, incluir embedding
      if (faceEmbedding) {
        updateData.facialId = faceEmbedding;
      }

      const result = await updateStudent(id, updateData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/students");
        }, 2000);
      } else {
        setError(result.message || "Erro ao atualizar aluno");
      }
    } catch (err) {
      setError(err.message || "Erro ao atualizar aluno");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStudent) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-blue-500 font-semibold text-lg">
            Carregando dados do aluno...
          </div>
        </div>
      </Layout>
    );
  }

  if (error && loadingStudent) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <div className="font-bold text-lg">Erro ao carregar aluno</div>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/students")}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft size={18} />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Editar Aluno</h1>
          <p className="text-gray-600 mt-2">
            Atualize os dados do aluno abaixo
          </p>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <FaCheck size={20} />
            Aluno atualizado com sucesso! Redirecionando...
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
          {/* Card 1: Dados Pessoais */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-600 px-8 py-6">
              <h2 className="text-xl font-bold text-white">Dados Pessoais</h2>
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

                {/* Matrícula */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Matrícula *
                  </label>
                  <input
                    type="text"
                    name="registration"
                    value={formData.registration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
                    placeholder="Ex: 2024001"
                  />
                </div>
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
                  Aluno Ativo
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

          {/* Card 2: Foto Facial */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-600 px-8 py-6">
              <h2 className="text-xl font-bold text-white">Foto Facial</h2>
              <p className="text-blue-100 text-sm mt-1">
                Atualize a foto para reconhecimento facial (opcional)
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-4">
                    Selecionar Imagem
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="faceImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="faceImage"
                      className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 cursor-pointer transition-colors duration-200"
                    >
                      <div className="text-center">
                        <FaCamera className="mx-auto mb-3 text-4xl text-gray-400" />
                        <p className="text-gray-700 font-medium">
                          Clique para selecionar
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          JPG, PNG ou WebP até 5MB
                        </p>
                      </div>
                    </label>
                  </div>
                  {faceProcessing && (
                    <p className="mt-2 text-blue-600 font-medium">
                      Processando imagem...
                    </p>
                  )}
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-4">
                    Pré-visualização
                  </label>
                  <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-200">
                    {facePreview ? (
                      <img
                        src={facePreview}
                        alt="Foto facial"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="text-5xl mb-2">📷</div>
                        <p>Nenhuma imagem selecionada</p>
                      </div>
                    )}
                  </div>
                  {faceEmbedding && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
                      <FaCheck size={16} />
                      Imagem processada com sucesso
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Turmas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-600 px-8 py-6">
              <h2 className="text-xl font-bold text-white">Turmas</h2>
              <p className="text-purple-100 text-sm mt-1">
                Selecione as turmas do aluno
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {["TURMA-2024-A", "TURMA-2024-B", "TURMA-2024-C"].map(
                  (classCode) => (
                    <div
                      key={classCode}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`class-${classCode}`}
                        checked={formData.classes.includes(classCode)}
                        onChange={() => handleClassToggle(classCode)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`class-${classCode}`}
                        className="ml-3 text-gray-700 font-medium cursor-pointer flex-1"
                      >
                        {classCode}
                      </label>
                      {formData.classes.includes(classCode) && (
                        <FaCheck size={16} className="text-purple-600" />
                      )}
                    </div>
                  )
                )}
              </div>
              {formData.classes.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm">
                  ⚠️ Nenhuma turma selecionada
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || faceProcessing}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Atualizando...
                </>
              ) : (
                <>
                  <FaCheck size={18} />
                  Atualizar Aluno
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
