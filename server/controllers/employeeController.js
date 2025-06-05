const Employee = require("../schema/employeeSchema");

const getAllEmplyoee = async (req, res) => {
  let fetch = await Employee.find({ role: "employee" }).select("-password");

  res.status(200).json({ success: true, data: fetch });
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    let deleteEmp = await Employee.findByIdAndDelete(id);

    if (!deleteEmp)
      return res
        .status(200)
        .json({ success: false, message: "Not Delete The User" });

    res.status(200).json({ success: true, message: "Delete the User", id });
  } catch (error) {
    res.status(200).json({ success: false, message: "Server Error" });
  }
};

const getSingleEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    let find = await Employee.findById(id).select("-password");

    if (!find)
      return res
        .status(200)
        .json({ success: false, message: "Not User Found" });

    res
      .status(200)
      .json({ success: true, message: "Delete the User", data: find });
  } catch (error) {
    res.status(200).json({ success: false, message: "Server Error" });
  }
};

module.exports = { deleteUser, getAllEmplyoee, getSingleEmployee };
