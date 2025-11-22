import {
    connectTestDB,
    clearTestDB,
    disconnectTestDB
} from "../setup/test-db.js";

import ClassSessionService from "../../src/services/ClassSessionService.js";
import ClassService from "../../src/services/ClassService.js";
import StudentService from "../../src/services/StudentService.js";

import ClassSession from "../../src/models/classSessionModel.js";
import Attendance from "../../src/models/attendanceModel.js";
import User from "../../src/models/userModel.js";

import {
    mockClass,
    mockClass2,
    mockStudent,
    mockStudent2,
    mockTeacher,
    mockClassSession
} from "../setup/mock-data.js";

import { NotFoundError } from "../../src/errors/appError.js";

describe("ClassSessionService - Testes Unitários", () => {

    let classA, classB, student1, student2, teacher, sessionA;

    beforeAll(async () => {
        await connectTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    beforeEach(async () => {
        // criar professor
        teacher = await User.create(mockTeacher);

        // criar turmas
        classA = await ClassService.create(mockClass);
        classB = await ClassService.create(mockClass2);

        // criar alunos
        student1 = await StudentService.create({ ...mockStudent, classCode: classA.code });
        student2 = await StudentService.create({ ...mockStudent2, classCode: classA.code });

        // criar sessão
        sessionA = await ClassSessionService.create({
            ...mockClassSession,
            teacherId: teacher._id,
            classId: classA._id,
            classCode: classA.code
        });
    });

    // -------------------------------------------------------------
    test("deve criar uma sessão de aula corretamente", async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        expect(sessionA.classId.toString()).toBe(classA._id.toString());
        expect(sessionA.teacherId.toString()).toBe(teacher._id.toString());
        expect(sessionA.name).toBe("Aula de Teste");
        expect(sessionA.status).toBe("open");
    });

    test("não deve marcar presença manual se sessão não existir", async () => {
        await expect(
            ClassSessionService.markAttendanceManually(
                "65aa9a6fc111111111111999",
                student1._id,
                "presente",
                teacher._id
            )
        ).rejects.toThrow(NotFoundError);
    });

    test("não deve marcar presença facial se sessão não existir", async () => {
        await expect(
            ClassSessionService.markAttendanceByFace("65aa9a6fc111111111111999", student1.facialId)
        ).rejects.toThrow(NotFoundError);
    });

    test("não deve marcar presença facial se aluno não existir", async () => {
        await expect(
            ClassSessionService.markAttendanceByFace(sessionA._id, "FACIAL_INEXISTENTE")
        ).rejects.toThrow(NotFoundError);
    });

    // -------------------------------------------------------------
    test("deve fechar sessão e impedir novas presenças", async () => {
        const closed = await ClassSessionService.closeSession(sessionA._id);
        expect(closed.isOpen).toBe(false);
    });

    test("não deve fechar sessão inexistente", async () => {
        await expect(ClassSessionService.closeSession("65aa9a6fc111111111111999"))
            .rejects.toThrow(NotFoundError);
    });

    // -------------------------------------------------------------
    test("deve fechar sessão com auditoria", async () => {
        const closed = await ClassSessionService.close(sessionA._id, teacher._id);
        expect(closed.isClosed).toBe(true);
        expect(closed.lastEditedBy.toString()).toBe(teacher._id.toString());
        expect(closed.lastEditedAt).toBeInstanceOf(Date);
    });

    // -------------------------------------------------------------
    test("deve resetar presenças da sessão", async () => {
        await ClassSessionService.markAttendanceManually(sessionA._id, student1._id, "presente", teacher._id);
        await ClassSessionService.markAttendanceManually(sessionA._id, student2._id, "presente", teacher._id);

        const result = await ClassSessionService.resetSessionAttendances(sessionA._id, teacher._id);
        expect(result.message).toBe("Presenças resetadas com sucesso.");

        const records = await Attendance.find({ session: sessionA._id });
        expect(records.length).toBe(0);
    });

    test("não deve resetar presenças de sessão inexistente", async () => {
        await expect(ClassSessionService.resetSessionAttendances("65aa9a6fc111111111111999", teacher._id))
            .rejects.toThrow(NotFoundError);
    });

});
