// tests/services/userService.test.js
import {
    connectTestDB,
    clearTestDB,
    disconnectTestDB
} from "../setup/test-db.js";

import UserService from "../../src/services/UserService.js";
import UserModel from "../../src/models/userModel.js";
import { mockCoordinator, mockTeacher } from "../setup/mock-data.js";

describe("UserService - Testes Unitários", () => {

    beforeAll(async () => {
        await connectTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    // -------------------------
    // TESTE: Criar usuário
    // -------------------------
    test("deve criar um novo usuário com sucesso", async () => {
        const created = await UserService.create(mockCoordinator);

        expect(created).toHaveProperty("_id");
        expect(created.email).toBe(mockCoordinator.email);
        expect(created.role).toBe("coordenador");

        const stored = await UserModel.findOne({ email: mockCoordinator.email });
        expect(stored).not.toBeNull();
    });

    // -------------------------
    // TESTE: evitar duplicidade
    // -------------------------
    test("não deve permitir email duplicado", async () => {
        await UserService.create(mockCoordinator);

        await expect(UserService.create(mockCoordinator)).rejects.toThrow();
    });

    // -------------------------
    // TESTE: buscar por ID
    // -------------------------
    test("deve retornar usuário pelo ID", async () => {
        const u = await UserService.create(mockTeacher);

        const found = await UserService.getById(u._id);
        expect(found.email).toBe(mockTeacher.email);
    });

    test("erro ao buscar ID inexistente", async () => {
        const fakeId = "64dbf5edc1e99a001236abcd";

        await expect(UserService.getById(fakeId)).rejects.toThrow();
    });

    // -------------------------
    // TESTE: atualizar usuário
    // -------------------------
    test("deve atualizar nome do usuário com sucesso", async () => {
        const user = await UserService.create(mockTeacher);

        const updated = await UserService.update(user._id, { name: "Novo Nome" });

        expect(updated.name).toBe("Novo Nome");
    });

    // -------------------------
    // TESTE: deletar usuário
    // -------------------------
    test("deve deletar usuário", async () => {
        const user = await UserService.create(mockTeacher);

        await UserService.delete(user._id);

        const deleted = await UserModel.findById(user._id);
        expect(deleted).toBeNull();
    });

    // -------------------------
    // TESTE: ativar / desativar
    // -------------------------
    test("deve ativar usuário", async () => {
        const user = await UserService.create({ ...mockTeacher, isActive: false });

        const updated = await UserService.update(user._id, { isActive: true });

        expect(updated.isActive).toBe(true);
    });

    test("deve desativar usuário", async () => {
        const user = await UserService.create({ ...mockTeacher, isActive: true });

        const updated = await UserService.update(user._id, { isActive: false });

        expect(updated.isActive).toBe(false);
    });
});
