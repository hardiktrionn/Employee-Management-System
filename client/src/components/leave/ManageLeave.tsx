import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  FiClock,
  FiEdit,
  FiFileText,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";
import { CgEye } from "react-icons/cg";
import {
  
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {  IoSearchSharp } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { Leave, setLeave } from "@/redux/leaveSlice";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import EditLeave from "./EditLeave";
import StateLeaveCards from "./StateLeaveCards";
import TableSkeleton from "../skelton/TableSkeleton";

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const ManageLeave = () => {
  const [sortColumn, setSortColumn] = useState<any>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewDetailsOpen, setViewDetailsOpen] = useState<boolean>(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editSheetOpen, setEditSheetOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);
  const { leave } = useSelector((state: RootState) => state.leave);
  const dispatch = useDispatch();

  // Fetch the user leave request
  const fetchLeaveData = useCallback(async () => {
    if (!user?.employeeId) return;

    try {
      setIsLoading(true);
      const res = await fetch(`../api/leave/fetch/${user.employeeId}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();
      if (result.success) {
        dispatch(setLeave(result.leaves));
      } else {
        if (result?.message?.server) toast.error(result?.message.server);
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [user?.employeeId, dispatch]);

  // if user change to refetch leave request
  useEffect(() => {
    if (user) {
      fetchLeaveData();
    }
  }, [user, fetchLeaveData,dispatch]);

  // update leave request state when data a load
  const stats: Stats = {
    total: leave.length,
    pending: leave.filter((l) => l.status === "Pending").length,
    approved: leave.filter((l) => l.status === "Approved").length,
    rejected: leave.filter((l) => l.status === "Rejected").length,
  };

  // Short the leave request according column
  const sortedLeaveRequests = [...leave].sort((a, b) => {
    if (!sortColumn) return 0;

    let comparison = 0;
    switch (sortColumn) {
      case "type":
        comparison = a.leaveType.localeCompare(b.leaveType);
        break;
      case "startDate":
        comparison =
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case "endDate":
        comparison =
          new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        break;
      case "duration":
        comparison = a.duration - b.duration;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "appliedDate":
        comparison =
          new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // change the short column
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // filtered leave request according leave status
  const filteredLeaveRequests = sortedLeaveRequests.filter((leave) => {
    const matchesSearch =
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      leave.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // count the total page for a pagination
  const totalPages = Math.ceil(filteredLeaveRequests.length / 10);

  // Show only current page data accroding total pages
  const paginatedLeaveRequests = filteredLeaveRequests.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  // show different badge for leave status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // delete the leave request if they in pedning stage
  const handleDeleteLeave = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`../api/leave/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();
      if (result.success) {
        let removeLeave = leave.filter((item) => item._id != id);
        dispatch(setLeave(removeLeave));
      } else {
        if (result?.message) toast.error(result?.message);
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) return <TableSkeleton />;
  return (
    <>
      {/* Leave Stats */}
      <StateLeaveCards stats={stats} />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
          <CardDescription>
            View and manage all your leave requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by leave type or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <FaFilter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leave Requests Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center">
                      Leave Type
                      {sortColumn === "type" && (
                        <RiArrowUpDownFill className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("startDate")}
                  >
                    <div className="flex items-center">
                      Start Date
                      {sortColumn === "startDate" && (
                        <RiArrowUpDownFill className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("endDate")}
                  >
                    <div className="flex items-center">
                      End Date
                      {sortColumn === "endDate" && (
                        <RiArrowUpDownFill className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("duration")}
                  >
                    <div className="flex items-center">
                      Days
                      {sortColumn === "days" && (
                        <RiArrowUpDownFill className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortColumn === "status" && (
                        <RiArrowUpDownFill className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("appliedDate")}
                  >
                    <div className="flex items-center">
                      Applied Date
                      {sortColumn === "appliedDate" && (
                        <RiArrowUpDownFill className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeaveRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No leave requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLeaveRequests.map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell className="font-medium">
                        {leave.leaveType}
                      </TableCell>
                      <TableCell>
                        {format(new Date(leave.startDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(leave.endDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>{leave.duration}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(leave.status) as any}
                        >
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(leave.appliedAt), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <FiMoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedLeave(leave);
                                setViewDetailsOpen(true);
                              }}
                            >
                              <CgEye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {leave.status === "Pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedLeave(leave);
                                    setEditSheetOpen(true);
                                  }}
                                >
                                  <FiEdit className="mr-2 h-4 w-4" />
                                  Edit Request
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedLeaveId(leave._id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <FiTrash2 className="mr-2 h-4 w-4" />
                                  Delete Request
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <FaChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete the Leave Request */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this leave request? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedLeaveId && handleDeleteLeave(selectedLeaveId)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Seen the Leave Request Details */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Leave Type</p>
                  <p className="font-medium">{selectedLeave.leaveType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={getStatusBadgeVariant(selectedLeave.status) as any}
                  >
                    {selectedLeave.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedLeave.startDate), "dd MMM yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedLeave.endDate), "dd MMM yyyy")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedLeave.duration} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <p className="font-medium">
                    {selectedLeave?.approvedAt
                      ? format(
                          new Date(selectedLeave.approvedAt),
                          "dd MMM yyyy"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                  {selectedLeave.reason}
                </p>
              </div>

              {/* {selectedLeave.approvedBy && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Approved By</p>
                                    <p className="font-medium">{selectedLeave.approvedBy}</p>
                                </div>
                            )} */}

              {selectedLeave.rejectedReason && (
                <div>
                  <p className="text-sm text-destructive">Rejection Reason</p>
                  <p className="text-sm mt-1 p-3 bg-destructive/10 text-destructive rounded-md">
                    {selectedLeave.rejectedReason}
                  </p>
                </div>
              )}

              {/* {selectedLeave.comments && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Comments</p>
                                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedLeave.comments}</p>
                                </div>
                            )} */}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditLeave
        editSheetOpen={editSheetOpen}
        setEditSheetOpen={setEditSheetOpen}
        selectedLeave={selectedLeave}
      />
    </>
  );
};

export default ManageLeave;
