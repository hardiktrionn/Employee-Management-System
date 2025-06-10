import express, { RequestHandler } from 'express';
import { applyLeave, getAllLeaveRequests, getMyLeaves, approveLeave, rejectLeave, deleteSingleLeave, editLeave } from '../controllers/leaveController';
import { isAdmin } from '../middleware/auth';
import { registerLeave } from '../validator/leaveValidator';

const router = express.Router();

router.post('/apply', registerLeave, applyLeave as RequestHandler);
router.get('/all', isAdmin as RequestHandler, getAllLeaveRequests);
router.get('/my/:id', getMyLeaves as RequestHandler);
router.put('/approve', isAdmin as RequestHandler, approveLeave);
router.put('/reject', isAdmin as RequestHandler, rejectLeave);
router.put("/edit/:id", editLeave)
router.delete("/delete/:id", deleteSingleLeave)

export default router;
