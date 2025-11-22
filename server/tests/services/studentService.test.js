import {
    connectTestDB,
    clearTestDB,
    disconnectTestDB
} from "../setup/test-db.js";

import StudentService from "../../src/services/StudentService.js";
import ClassModel from "../../src/models/classModel.js";
import StudentModel from "../../src/models/studentModel.js";

import {
    mockClass,
    mockClass2,
    mockStudent,
    mockStudent2
} from "../setup/mock-data.js";

describe("StudentService - Testes Unitários", () => {

    let createdClass;

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
        await ClassModel.deleteMany();
        await StudentModel.deleteMany();

        createdClass = await ClassModel.create(mockClass);
    });

    // -------------------------------------------------------------
    test("deve criar um aluno com sucesso", async () => {

        // service espera classCode, mas mock usa classes: []
        const studentData = {
            ...mockStudent,
            classCode: createdClass.code
        };

        const created = await StudentService.create(studentData);

        expect(created.name).toBe(mockStudent.name);
        expect(created.facialId).toBe(mockStudent.facialId);
        expect(created.classes).toContain(createdClass.code);
        expect(created.registration).toBe(mockStudent.registration);
    });

    // -------------------------------------------------------------
    test("não deve criar aluno com facialId duplicado", async () => {

        const s = {
            ...mockStudent,
            classCode: createdClass.code
        };

        await StudentService.create(s);

        await expect(StudentService.create(s))
            .rejects
            .toThrow("Este facialId já está registrado para outro aluno.");
    });

    // -------------------------------------------------------------
    test("não deve criar aluno com classe inexistente", async () => {

        const wrong = {
            ...mockStudent,
            classCode: "ABCD1234"
        };

        await expect(StudentService.create(wrong))
            .rejects
            .toThrow("A turma informada não existe.");
    });

    // -------------------------------------------------------------
    test("deve buscar alunos por código da turma", async () => {

        const s = await StudentService.create({
            ...mockStudent,
            classCode: createdClass.code
        });

        const found = await StudentService.getByClassCode(createdClass._id);

        expect(found.length).toBe(1);
        expect(found[0].registration).toBe(s.registration);
    });

    // -------------------------------------------------------------
    test("getByClassCode deve falhar ao informar ID inválido", async () => {
        await expect(StudentService.getByClassCode(null))
            .rejects.toThrow("O ID da turma é obrigatório.");
    });

    // -------------------------------------------------------------
    test("deve atualizar dados do aluno (exceto facialId)", async () => {

        const created = await StudentService.create({
            ...mockStudent,
            classCode: createdClass.code
        });

        const updated = await StudentService.update(created._id, {
            name: "Novo Nome"
        });

        expect(updated.name).toBe("Novo Nome");
    });

    // -------------------------------------------------------------
    test("update deve falhar ao tentar alterar facialId", async () => {

        const created = await StudentService.create({
            ...mockStudent,
            classCode: createdClass.code
        });

        await expect(
            StudentService.update(created._id, { facialId: "NOVO123" })
        ).rejects.toThrow("Use a rota correta para atualizar reconhecimento facial");
    });

    // -------------------------------------------------------------
    test("updateFaceData deve alterar o facialId com sucesso", async () => {

        const created = await StudentService.create({
            ...mockStudent,
            classCode: createdClass.code
        });

        const updated = await StudentService.updateFaceData(created._id, "NEWFACE");

        expect(updated.facialId).toBe("NEWFACE");
    });

    // -------------------------------------------------------------
    test("updateFaceData deve falhar se facialId já existir", async () => {

        await StudentService.create({
            ...mockStudent,
            classCode: createdClass.code
        });

        const other = await StudentService.create({
            ...mockStudent2,
            classCode: createdClass.code
        });

        await expect(
            StudentService.updateFaceData(other._id, mockStudent.facialId)
        ).rejects.toThrow("Este facialId já está vinculado a outro aluno.");
    });

    // -------------------------------------------------------------
    test("deve adicionar aluno a uma nova turma", async () => {

        const createdStudent = await StudentService.create({
            ...mockStudent,
            classCode: createdClass.code
        });

        const newClass = await ClassModel.create(mockClass2);

        const updated = await StudentService.addClass(
            createdStudent._id,
            newClass.code
        );

        expect(updated.classes).toContain(createdClass.code);
        expect(updated.classes).toContain(newClass.code);
    });

    // -------------------------------------------------------------
    test("deve remover aluno de uma turma", async () => {

        const createdStudent = await StudentService.create({
            ...mockStudent,
            classCode: createdClass.code
        });

        // adiciona turma B
        createdStudent.classes.push(mockClass2.code);
        await createdStudent.save();

        const updated = await StudentService.removeClass(
            createdStudent._id,
            mockClass2.code
        );

        expect(updated.classes).not.toContain(mockClass2.code);
        expect(updated.classes).toContain(mockClass.code);
    });

    // -------------------------------------------------------------
    test("removeClass deve falhar se aluno não existir", async () => {

        await expect(
            StudentService.removeClass(
                "65aa9a6fc111111111111111",
                mockClass.code
            )
        ).rejects.toThrow("Aluno não encontrado.");
    });

});
