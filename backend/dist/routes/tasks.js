"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
// Protect all task routes with authentication middleware
router.use(auth_1.authenticate);
router.post('/', taskController_1.createTask);
router.get('/', taskController_1.getTasks);
router.get('/:id', taskController_1.getTaskById);
router.put('/:id', taskController_1.updateTask);
router.delete('/:id', taskController_1.deleteTask);
exports.default = router;
//# sourceMappingURL=tasks.js.map