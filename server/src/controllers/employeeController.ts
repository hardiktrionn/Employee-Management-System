import { Request, Response } from "express";
import Employee from "../schema/employeeSchema"; // Adjust path as necessary

// get all employee data
export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await Employee.find({ role: "employee" }).select("-password");
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE a user by ID
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedEmp = await Employee.findByIdAndDelete(id);

    if (!deletedEmp) {
      res.status(404).json({ success: false, message: "User not found or already deleted" });
      return;
    }

    res.status(200).json({ success: true, message: "User deleted successfully", id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET a single employee data by ID
export const getSingleEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).select("-password");

    if (!employee) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, message: "User fetched successfully", data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
