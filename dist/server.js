"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promise_1 = __importDefault(require("mysql2/promise"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const dbKeys = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
};
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const db = promise_1.default.createPool(dbKeys);
function getTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield db.execute('SELECT * FROM myTable');
        return rows;
    });
}
function addTask(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result] = yield db.execute('INSERT INTO myTable (name) VALUES (?)', [value]);
        return result;
    });
}
function deleteTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result] = yield db.execute('DELETE FROM myTable WHERE id = ?', [id]);
        return result;
    });
}
function editTask(id, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result] = yield db.execute('UPDATE myTable SET name = ? WHERE id = ?', [newName, id]);
        return result;
    });
}
app.get('/api/getTasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getTasks();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server error" });
    }
}));
app.post('/api/postTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: "Name is required" });
        }
        const [result] = yield db.execute('INSERT INTO myTable (name) VALUES (?)', [name]);
        res.json({ message: 'Task added successfully', id: result.insertId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.delete('/api/deleteTask/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid ID' });
        }
        const result = yield deleteTask(id);
        res.json({ message: 'Task deleted successfully', result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.patch('/api/editTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = req.body;
        if (!id || !name) {
            res.status(400).json({ error: 'ID and name are required' });
        }
        const result = yield editTask(id, name);
        res.json({ message: 'Task edited successfully', result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.listen(PORT, () => {
    console.log('Server started successfully');
});
