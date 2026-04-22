import express from 'express';
import { handleSecurityFlow, approveStranger, rejectStranger, allowStranger } from '../controllers/securityController.ts';

const router = express.Router();

// Route chính để Web check trạng thái trigger và chạy camera
router.get('/security/check', handleSecurityFlow);

// Các route để xử lý nút bấm trên giao diện Card
router.post('/security/approve', approveStranger);
router.post('/security/reject', rejectStranger);
router.post('/security/allow', allowStranger);

export default router;