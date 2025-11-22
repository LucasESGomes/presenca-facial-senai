// ---------------------------
// USERS
// ---------------------------
export const mockTeacher = {
    name: "Professor Silva",
    email: "silva@example.com",
    password: "123456",
    role: "professor",
};

export const mockCoordinator = {
    name: "Coordenador João",
    email: "joao@example.com",
    password: "123456",
    role: "coordenador",
};

// ---------------------------
// CLASS
// ---------------------------
export const mockClass = {
    code: "I2P4",
    course: "Informática",
    shift: "manhã",
    year: 2025,
    teachers: []
};

// segunda turma opcional
export const mockClass2 = {
    code: "EL1A",
    course: "Eletricista Industrial",
    shift: "tarde",
    year: 2025,
    teachers: []
};

// ---------------------------
// STUDENT
// ---------------------------
export const mockStudent = {
    name: "Aluno Teste",
    registration: "2025001",
    facialId: "FACIAL123",
    classCode: "I2P4",
    classes: ["I2P4"]
};

export const mockStudent2 = {
    name: "Aluno 2",
    registration: "2025002",
    facialId: "FACIAL999",
    classCode: "I2P4",
    classes: ["I2P4"]
};

// ---------------------------
// CLASS SESSION
// ---------------------------
export const mockClassSession = {
    name: "Aula de Teste",
    teacherId: "", // será substituído pelo ObjectId do teacher durante o teste
    classId: "",   // será substituído pelo ObjectId da turma durante o teste
    date: new Date(),
    status: "open"
};
