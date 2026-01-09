import Layout from "../components/layout/Layout";
import { useClasses } from "../hooks/useClasses";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

//icons
import { IoPeopleSharp } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa6";
import { MdPlace } from "react-icons/md";

export default function ClassesPage() {
  const { classes, loading, error, loadClasses, loadMyClasses } = useClasses();
  const { user } = useAuth();

  //Usando o context para diferenciar o get conforme o role
  useEffect(() => {
    if (user?.role === 'professor') {
      loadMyClasses();
    } else {
      loadClasses();
    }
  }, [user?.role, loadClasses, loadMyClasses]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-blue-500 font-semibold text-lg">
            Carregando turmas...
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <div className="font-bold text-lg mb-2">Erro ao carregar turmas</div>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Turmas</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todas as turmas do sistema
            </p>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
            Total: <span className="font-bold">{classes.length} turmas</span>
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma turma encontrada
            </h3>
            <p className="text-gray-500">
              Não há turmas cadastradas no sistema ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((turma) => (
              <div
                key={turma.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Cabeçalho do card */}
                <div className="bg-red-500 px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {turma.code}
                      </h2>
                      <p className="text-blue-100 text-sm mt-1">
                        {turma.course}
                      </p>
                    </div>
                    <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {turma.year}
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {turma.shift}
                    </span>
                  </div>
                </div>

                {/* Corpo do card */}
                <div className="p-6">
                  {/* Professores */}
                  <div className="mb-4">
                    <div className="flex items-center text-gray-700 mb-2">
                      <IoPeopleSharp size={18} className="text-gray-400"/>
                      <span className="ml-2 font-semibold">Professores</span>
                    </div>
                    <p className="text-gray-800 ml-7">
                      {turma.teachers?.map((prof) => prof.name).join(", ") ||
                        "Nenhum professor"}
                    </p>
                  </div>

                  {/* Salas */}
                  <div className="mb-4">
                    <div className="flex items-center text-gray-700 mb-2">
                      <FaBuilding size={18} className="text-gray-400"/> 
                      <span className="ml-2 font-semibold">Salas</span>
                    </div>
                    <p className="text-gray-800 ml-7">
                      {turma.rooms?.map((sala) => sala.name).join(", ") ||
                        "Nenhuma sala"}
                    </p>
                  </div>

                  {/* Local */}
                  <div>
                    <div className="flex items-center text-gray-700 mb-2">
                      <MdPlace size={20} className="text-gray-400"/>
                      <span className="ml-2 font-semibold">Local</span>
                    </div>
                    <p className="text-gray-800 ml-7">
                      {turma.rooms?.map((lugar) => lugar.location).join(", ") ||
                        "Não informado"}
                    </p>
                  </div>
                </div>

                {/* Rodapé do card */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex justify-end items-center">
                    <button className="text-gray-600 hover:text-black font-medium text-sm px-4 py-1 hover:bg-red-50 rounded-lg transition-colors duration-200">
                      Ver detalhes
                    </button>
                    <button className="ml-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-4 py-1 rounded-lg transition-colors duration-200">
                      Gerenciar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
