import { connectTestDB, clearTestDB, disconnectTestDB } from "./test-db.js";

// Antes de rodar QUALQUER teste
beforeAll(async () => {
    await connectTestDB();
});

// Antes de cada teste, limpar coleções
beforeEach(async () => {
    await clearTestDB();
});

// Depois de TODOS os testes
afterAll(async () => {
    await disconnectTestDB();
});
