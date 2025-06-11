import { Request, Response } from "express";
import LeaveRequest from "../schema/leaveSchema"
import { validationResult } from "express-validator";
import extractError, { ValidationError } from "../utils/extractError";
import sendEmail from "../utils/sendEmail";


interface AuthRequest extends Request {
    user?: { id: string; role: string, email: string, name: string };
}

// new Leave request register
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

        await sendEmail("hardik.trionn@gmail.com", "New Leave Request", ` <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
    <div style="padding: 20px; border: 1px solid #e0e0e0; max-width: 600px; margin: auto; background-color: #ffffff;">
      <h2 style="color: #2a7ae2; margin-top: 0;">New Leave Request Submitted</h2>
      <p style="margin: 10px 0;">A new leave request has been submitted. Please find the details below:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px 10px; font-weight: bold; background-color: #f0f0f0; width: 30%;">Employee Name</td>
          <td style="padding: 8px 10px;">${req.user?.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 10px; font-weight: bold; background-color: #f0f0f0;">Leave Type</td>
          <td style="padding: 8px 10px;">${leaveType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 10px; font-weight: bold; background-color: #f0f0f0;">Start Date</td>
          <td style="padding: 8px 10px;">${startDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 10px; font-weight: bold; background-color: #f0f0f0;">End Date</td>
          <td style="padding: 8px 10px;">${endDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 10px; font-weight: bold; background-color: #f0f0f0;">Duration</td>
          <td style="padding: 8px 10px;">${duration} day(s)</td>
        </tr>
        <tr>
          <td style="padding: 8px 10px; font-weight: bold; background-color: #f0f0f0;">Reason</td>
          <td style="padding: 8px 10px;">${reason}</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">Please log in to the HR portal to review and take necessary action.</p>
    </div>
  </body>`);
        res.status(201).json({ message: { server: 'Leave applied successfully.' }, leave, success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: { server: 'Error applying for leave.' }, success: false });
    }
};

// get all Request of all employee
export const getAllLeaveRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const leaves = await LeaveRequest.find().populate('employee', 'name employeeId email profilePhoto');
        res.status(200).json({ leaves, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave requests.', success: false });
    }
};

// get employee leave request
export const getMyLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const leaves = await LeaveRequest.find({ employee: req.user?.id });
        res.status(200).json({ leaves, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaves.', success: false });
    }
};

// give approve the leave request
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

// give rejection the leave request
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

// delete the leave request
export const deleteSingleLeave = async (req: Request, res: Response): Promise<void> => {
    try {
        const leave = await LeaveRequest.findById(req.params.id).populate("email name");
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

// edit the leave request
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

interface DataProps {
    status: string
    name: string
    leaveType: string
    startDate: string
    endDate: string
    reason: string
    duration: number
    rejectedReson: string
}
