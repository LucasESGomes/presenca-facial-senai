import {
    connectTestDB,
    clearTestDB,
    disconnectTestDB
} from "../setup/test-db.js";

import AttendanceService from "../../src/services/AttendanceService.js";
import ClassService from "../../src/services/ClassService.js";
import StudentService from "../../src/services/StudentService.js";

import ClassSession from "../../src/models/classSessionModel.js";
import Attendance from "../../src/models/attendanceModel.js";

import {
    mockClass,
    mockClass2,
    mockStudent,
    mockStudent2,
    mockTeacher,
    mockClassSession
} from "../setup/mock-data.js";

import User from "../../src/models/userModel.js";

describe("AttendanceService - Testes Unitários", () => {

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
        sessionA = await ClassSession.create({
            ...mockClassSession,
            teacherId: teacher._id,
            classId: classA._id,
            classCode: classA.code
        });
    });

    // -------------------------------------------------------------
    test("deve registrar presença via reconhecimento facial", async () => {
        const attendance = await AttendanceService.markPresenceByFace(
            student1.facialId,
            sessionA._id,
            classA.code
        );

        expect(attendance.student.toString()).toBe(student1._id.toString());
        expect(attendance.classCode).toBe(classA.code);
        expect(attendance.status).toBe("presente");
    });

    // -------------------------------------------------------------
    test("não deve registrar presença facial se aluno não pertence à turma", async () => {
        // aluno pertence à I2P4, mas enviamos EL1A
        await expect(
            AttendanceService.markPresenceByFace(
                student1.facialId,
                sessionA._id,
                classB.code
            )
        ).rejects.toThrow("Aluno não pertence a esta turma.");
    });

    // -------------------------------------------------------------
    test("deve registrar presença manual", async () => {
        const attendance = await AttendanceService.markPresenceManual({
            sessionId: sessionA._id,
            studentId: student1._id,
            status: "presente",
            recordedBy: teacher._id,
            classCode: classA.code
        });

        expect(attendance.status).toBe("presente");
        expect(attendance.method).toBe("manual");
    });

    // -------------------------------------------------------------
    test("não deve registrar manualmente aluno de outra turma", async () => {
        await expect(
            AttendanceService.markPresenceManual({
                sessionId: sessionA._id,
                studentId: student1._id,
                status: "presente",
                recordedBy: teacher._id,
                classCode: classB.code
            })
        ).rejects.toThrow("Aluno não pertence a esta turma.");
    });

    // -------------------------------------------------------------
    test("deve gerar ausências automáticas corretamente", async () => {

        // registrar presença apenas do student1
        await AttendanceService.markPresenceManual({
            sessionId: sessionA._id,
            studentId: student1._id,
            status: "presente",
            recordedBy: teacher._id,
            classCode: classA.code
        });

        const result = await AttendanceService.markAbsencesForSession(sessionA._id);

        expect(result.created).toBe(1);

        const records = await Attendance.find();
        expect(records.length).toBe(2);
    });

    // -------------------------------------------------------------
    test("deve retornar relatório completo da sessão", async () => {
        await AttendanceService.markPresenceManual({
            sessionId: sessionA._id,
            studentId: student1._id,
            status: "presente",
            recordedBy: teacher._id,
            classCode: classA.code
        });

        const report = await AttendanceService.getFullReportBySession(sessionA._id);

        expect(report.presentes.length).toBe(1);
        expect(report.ausentes.length).toBe(1);
    });

});
