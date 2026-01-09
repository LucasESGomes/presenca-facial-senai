// tests/services/classService.test.js
import {
    connectTestDB,
    clearTestDB,
    disconnectTestDB
} from "../setup/test-db.js";

import ClassService from "../../src/services/ClassService.js";
import UserService from "../../src/services/UserService.js";
import ClassModel from "../../src/models/classModel.js";
import { mockClass, mockTeacher } from "../setup/mock-data.js";

describe("ClassService - Testes Unitários", () => {

    beforeAll(async () => {
        await connectTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    // -----------------------------------------------------
    // 1 — Criar turma
    // -----------------------------------------------------
    test("deve criar uma turma com sucesso", async () => {
        const created = await ClassService.create(mockClass);

        expect(created).toHaveProperty("_id");
        expect(created.code).toBe(mockClass.code);
    });

    // -----------------------------------------------------
    // 2 — Evitar duplicidade
    // -----------------------------------------------------
    test("não deve permitir códigos duplicados", async () => {
        await ClassService.create(mockClass);

        await expect(ClassService.create(mockClass))
            .rejects
            .toThrow("Já existe uma turma com este código.");
    });

    // -----------------------------------------------------
    // 3 — Buscar turma por código
    // -----------------------------------------------------
    test("deve buscar turma pelo código", async () => {
        await ClassService.create(mockClass);

        const result = await ClassService.getByCode(mockClass.code);

        expect(result.code).toBe(mockClass.code);
    });

    // -----------------------------------------------------
    // 4 — Erro ao buscar código inexistente
    // -----------------------------------------------------
    test("erro ao buscar turma inexistente", async () => {
        await expect(ClassService.getByCode("XYZ99"))
            .rejects
            .toThrow("Turma não encontrada.");
    });

    // -----------------------------------------------------
    // 5 — Atualizar turma
    // -----------------------------------------------------
    test("deve atualizar dados da turma", async () => {
        const created = await ClassService.create(mockClass);

        const updated = await ClassService.updateClass(created._id, {
            course: "Informática avançada"
        });

        expect(updated.course).toBe("Informática avançada");
    });

    // -----------------------------------------------------
    // 6 — Adicionar professor à turma
    // -----------------------------------------------------
    test("deve adicionar um professor à turma", async () => {
        const prof = await UserService.create(mockTeacher);
        const turma = await ClassService.create(mockClass);

        const updated = await ClassService.addTeacher(turma._id, prof._id);

        expect(updated.teachers.length).toBe(1);
    });

    // -----------------------------------------------------
    // 7 — Remover professor da turma
    // -----------------------------------------------------
    test("deve remover professor da turma", async () => {
        const prof = await UserService.create(mockTeacher);
        const turma = await ClassService.create(mockClass);

        await ClassService.addTeacher(turma._id, prof._id);

        const updated = await ClassService.removeTeacher(turma._id, prof._id);

        expect(updated.teachers.length).toBe(0);
    });

    // -----------------------------------------------------
    // 8 — Listar professores da turma
    // -----------------------------------------------------
    test("deve retornar professores da turma", async () => {
        const prof = await UserService.create(mockTeacher);
        const turma = await ClassService.create(mockClass);

        await ClassService.addTeacher(turma._id, prof._id);

        const data = await ClassService.getTeachers(turma._id);

        expect(data.teachers.length).toBe(1);
        expect(data.teachers[0].email).toBe(mockTeacher.email);
    });

});
