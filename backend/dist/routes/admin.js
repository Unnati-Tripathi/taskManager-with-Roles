"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use(admin_1.isAdmin);
router.get('/dashboard', adminController_1.getDashboardAnalytics);
exports.default = router;
//# sourceMappingURL=admin.js.map