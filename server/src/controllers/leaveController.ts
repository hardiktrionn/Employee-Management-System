import { Request, Response } from "express";
import LeaveRequest from "../schema/leaveSchema"
import { validationResult } from "express-validator";
import extractError, { ValidationError } from "../utils/extractError";


interface AuthRequest extends Request {
    user?: { id: string; role: string };
}


export const applyLeave = async (req: AuthRequest, res: Response): Promise<void> => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        let message = extractError(error.array() as ValidationError[]);
        res.status(422).json({ success: false, message });
        return
    }

    try {
        const { leaveType, startDate, endDate, reason, duration } = req.body;
        const isAllreadyTaken = await LeaveRequest.findOne({ employee: req.user?.id, startDate: { $lte: startDate }, endDate: { $gte: endDate }, status: "Approved" })

        if (isAllreadyTaken) {
            res.status(201).json({ message: { server: 'Allready Taken the Leave.' }, success: false });
            return
        }
        const leave = await LeaveRequest.create({
            employee: req.user?.id,
            leaveType,
            startDate,
            endDate,
            reason, duration
        });

        res.status(201).json({ message: { server: 'Leave applied successfully.' }, leave, success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: { server: 'Error applying for leave.' }, success: false });
    }
};

export const getAllLeaveRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const leaves = await LeaveRequest.find().populate('employee', 'name employeeId email profilePhoto');
        res.status(200).json({ leaves, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave requests.', success: false });
    }
};

export const getMyLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const leaves = await LeaveRequest.find({ employee: req.user?.id });
        res.status(200).json({ leaves, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaves.', success: false });
    }
};

export const approveLeave = async (req: Request, res: Response): Promise<void> => {
    try {
        const { requestsToUpdate } = req.body
        let approvedAt = new Date()
        await LeaveRequest.updateMany({ _id: { $in: requestsToUpdate } }, {
            status: "Approved",
            approvedAt
        });

        res.status(200).json({ message: 'Leave approved successfully.', success: true, approvedAt });
    } catch (error) {
        res.status(500).json({ message: 'Error approving leave.', success: false });
    }
};

export const rejectLeave = async (req: Request, res: Response): Promise<void> => {
    try {
        const { requestsToUpdate, reason } = req.body

        let rejectedAt = new Date()
        await LeaveRequest.updateMany({ _id: { $in: requestsToUpdate } }, {
            status: "Rejected",
            rejectedReason: reason,
            rejectedAt
        });

        res.status(200).json({ message: 'Leave rejected successfully.', success: true, rejectedAt, reason });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting leave.', success: false });
    }
};

export const deleteSingleLeave = async (req: Request, res: Response): Promise<void> => {
    try {
        const leave = await LeaveRequest.findById(req.params.id);
        if (!leave) {
            res.status(404).json({ message: 'Leave not found', success: false });
            return
        }

        if (leave.status != "Pending") {
            res.status(401).json({ message: 'Not Delete The Leave Request', success: false });
            return
        }
        await LeaveRequest.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Leave Deleted successfully.', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting leave.', success: false });
    }
}
export const editLeave = async (req: Request, res: Response): Promise<void> => {
    try {

        const leave = await LeaveRequest.findById(req.params.id);
        if (!leave) {
            res.status(404).json({ message: 'Leave not found', success: false });
            return
        }

        if (leave.status != "Pending") {
            res.status(401).json({ message: 'Not Edit The Leave Request', success: false });
            return
        }
        const { leaveType, startDate, endDate, reason, duration } = req.body;

        await LeaveRequest.findByIdAndUpdate(req.params.id, {
            leaveType, startDate, endDate, reason, duration
        })
        res.status(200).json({ message: 'Leave successfully Updated.', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting leave.', success: false });
    }
}
