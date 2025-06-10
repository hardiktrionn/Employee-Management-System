"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { LuArrowUpDown } from "react-icons/lu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdAdminPanelSettings } from "react-icons/md";
import toast from "react-hot-toast";
import StateLeaveCards from "@/components/leave/StateLeaveCards";
import { useDispatch, useSelector } from "react-redux";
import { Leave, setLeave } from "@/redux/adminSlice";
import { RootState } from "@/lib/store";
import { FiFileText, FiMoreHorizontal } from "react-icons/fi";
import { TbTrendingUp } from "react-icons/tb";
import { IoClose, IoEyeOutline, IoSearch } from "react-icons/io5";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaUserCheck,
} from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { DialogDescription } from "@radix-ui/react-dialog";
import LeaveSkeleton from "@/components/skelton/LeaveSkeleton";

export default function AdminLeavePage() {
  const dispatch = useDispatch();
  const { leave } = useSelector((state: RootState) => state.admin);
  const { user } = useSelector((state: RootState) => state.user);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [adminComments, setAdminComments] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>("appliedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const fetchLeaveData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`../api/leave/fetch-all`, {
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
  }, []);

  useEffect(() => {
    if (user) {
      fetchLeaveData();
    }
  }, [fetchLeaveData, user]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredLeaveRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredLeaveRequests.map((req) => req._id));
    }
  };

  const handleAction = async (
    action: "approve" | "reject",
    requestId?: string
  ) => {
    setIsProcessing(true);
    const requestsToUpdate = requestId ? [requestId] : selectedRequests;

    try {
      const res = await fetch(`../api/leave/action/${action}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestsToUpdate,
          reason: action === "reject" ? adminComments : null,
        }),
      });

      const result = await res.json();
      if (result.success) {
        const updateSet = new Set(requestsToUpdate);

        const updateLeaveData: Leave[] = leave.map((item) => {
          if (updateSet.has(item._id)) {
            return {
              ...item,

              ...(action === "reject"
                ? {
                    rejectedReason: result.reason,
                    rejectedAt: result.rejectedAt,
                    status: "Rejected",
                  }
                : {
                    approvedAt: result.approvedAt,
                    status: "Approved",
                  }),
            };
          }
          return item;
        });

        dispatch(setLeave(updateLeaveData));
      } else {
        if (result?.message?.server) toast.error(result?.message.server);
      }

      setActionSheetOpen(false);
      setSelectedRequests([]);
      setViewDetailsOpen(false);
      toast.success(`Successfully ${action}`);
    } catch (error) {
      console.log(error);
      toast.error(`Failed to ${action} leave request. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkAction = (action: "approve" | "reject") => {
    if (selectedRequests.length === 0) {
      toast.error("Please select at least one leave request.");
      return;
    }

    setActionType(action);
    setActionSheetOpen(true);
  };

  const sortedLeaveRequests = [...leave].sort((a, b) => {
    if (!sortColumn) return 0;

    let comparison = 0;
    switch (sortColumn) {
      case ".employee.name":
        comparison = a.employee.name.localeCompare(b.employee.name);
        break;
      case "type":
        comparison = a.leaveType.localeCompare(b.leaveType);
        break;
      case "startDate":
        comparison =
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case "days":
        comparison = a.duration - b.duration;
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "appliedDate":
        comparison =
          new Date(a?.approvedAt ?? "").getTime() -
          new Date(b.approvedAt ?? "").getTime();
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const filteredLeaveRequests = sortedLeaveRequests.filter((leave) => {
    const matchesSearch =
      leave.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      leave.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeaveRequests.length / itemsPerPage);
  const paginatedLeaveRequests = filteredLeaveRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const stats = {
    total: leave.length,
    pending: leave.filter((l) => l.status === "Pending").length,
    approved: leave.filter((l) => l.status === "Approved").length,
    rejected: leave.filter((l) => l.status === "Rejected").length,
  };

  if(isLoading)return <LeaveSkeleton/>
  return (
    <div className="p-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Admin Leave Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and approve leave requests across the organization.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TbTrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FiFileText className="w-4 h-4" />
              All Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <StateLeaveCards stats={stats} />

            {/* Recent Pending Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdAdminPanelSettings className="w-5 h-5" />
                  Recent Pending Requests
                </CardTitle>
                <CardDescription>
                  Latest leave requests requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leave
                    .filter((req) => req.status === "Pending")
                    .slice(0, 5)
                    .map((request) => (
                      <div
                        key={request._id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={
                                request.employee.profilePhoto ||
                                "/placeholder.svg"
                              }
                            />
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {request.employee.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.leaveType} • {request.duration} days
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedLeave(request);
                              setViewDetailsOpen(true);
                            }}
                          >
                            <IoEyeOutline className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            {/* Bulk Actions */}
            {selectedRequests.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {selectedRequests.length} requests selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("approve")}
                      >
                        <FaUserCheck className="w-4 h-4 mr-1" />
                        Approve Selected
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("reject")}
                      >
                        <FaUserXmark className="w-4 h-4 mr-1" />
                        Reject Selected
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedRequests([])}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle>All Leave Requests</CardTitle>
                <CardDescription>
                  Manage leave requests from all employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by employee, type, or reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-[150px]">
                      <SelectValue placeholder="Status" />
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
      <TableHead className="w-12">
        <Checkbox
          checked={filteredLeaveRequests.length > 0 && selectedRequests.length === filteredLeaveRequests.length}
          onCheckedChange={handleSelectAll}
        />
      </TableHead>

      {[
        { label: "Employee", key: ".employee.name" },
        { label: "Type", key: "type" },
        { label: "Days", key: "Days" },
        { label: "Duration", key: "duration" },
        { label: "Status", key: "status" },
      ].map((col) => (
        <TableHead
          key={col.key}
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => handleSort(col.key)}
        >
          <div className="flex items-center">
            {col.label}
            {sortColumn === col.key && <LuArrowUpDown className="ml-2 h-4 w-4" />}
          </div>
        </TableHead>
      ))}

      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {paginatedLeaveRequests.length === 0 ? (
      <TableRow>
        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
          No leave requests found
        </TableCell>
      </TableRow>
    ) : (
      paginatedLeaveRequests.map((request) => (
        <TableRow key={request._id}>
          <TableCell>
            <Checkbox
              checked={selectedRequests.includes(request._id)}
              onCheckedChange={() => handleSelectRequest(request._id)}
            />
          </TableCell>

          {/* Employee Cell */}
          <TableCell>
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={request.employee.profilePhoto || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {request.employee.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="font-medium">{request.employee.name}</div>
            </div>
          </TableCell>

          {/* Leave Type */}
          <TableCell>{request.leaveType}</TableCell>

          {/* Days */}
          <TableCell>
            <div className="text-sm">
              <div>{format(new Date(request.startDate), "dd MMM")}</div>
              <div className="text-muted-foreground">
                to {format(new Date(request.endDate), "dd MMM")}
              </div>
            </div>
          </TableCell>

          {/* Duration */}
          <TableCell>{request.duration}</TableCell>

          {/* Status */}
          <TableCell>
            <Badge variant={getStatusBadgeVariant(request.status) as any}>
              {request.status}
            </Badge>
          </TableCell>

          {/* Actions */}
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
                    setSelectedLeave(request);
                    setViewDetailsOpen(true);
                  }}
                >
                  <IoEyeOutline className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>

                {request.status === "Pending" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        setActionType("approve");
                        setSelectedLeave(request);
                        setActionSheetOpen(true);
                      }}
                    >
                      <FaCheck className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setActionType("reject");
                        setSelectedLeave(request);
                        setActionSheetOpen(true);
                      }}
                    >
                      <IoClose className="mr-2 h-4 w-4" />
                      Reject
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
          </TabsContent>
        </Tabs>

        {/* View Details Dialog */}
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
            </DialogHeader>
            {selectedLeave && (
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={
                        selectedLeave.employee.profilePhoto ||
                        "/placeholder.svg"
                      }
                    />
                    <AvatarFallback>
                      {selectedLeave.employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg">
                      {selectedLeave.employee.name}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {selectedLeave.employee.email}
                    </div>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Leave Type</p>
                    <p className="font-medium">{selectedLeave.leaveType}</p>
                  </div>

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
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedLeave.duration} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Applied On</p>
                    <p className="font-medium">
                      {format(new Date(selectedLeave.appliedAt), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                    {selectedLeave.reason}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={getStatusBadgeVariant(selectedLeave.status) as any}
                    className="mt-1"
                  >
                    {selectedLeave.status}
                  </Badge>
                </div>

                {selectedLeave.rejectedReason && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="text-sm mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      {selectedLeave.rejectedReason}
                    </p>
                  </div>
                )}

                {selectedLeave.status === "Pending" && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => {
                        setActionType("approve");
                        setViewDetailsOpen(false);
                        setActionSheetOpen(true);
                      }}
                      className="flex-1"
                    >
                      <FaCheck className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActionType("reject");
                        setViewDetailsOpen(false);
                        setActionSheetOpen(true);
                      }}
                      className="flex-1"
                    >
                      <IoClose className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewDetailsOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Sheet */}

        <Dialog open={actionSheetOpen} onOpenChange={setActionSheetOpen}>
          <DialogContent className="sm:max-w-[600px] px-5 py-10">
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Approve" : "Reject"} Leave Request
                {selectedRequests.length > 1 ? "s" : ""}
              </DialogTitle>
              <DialogDescription>
                {selectedRequests.length > 1
                  ? `You are about to ${actionType} ${selectedRequests.length} leave requests.`
                  : `You are about to ${actionType} this leave request.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              {actionType == "reject" && (
                <div className="space-y-3">
                  <Label htmlFor="adminComments">Reason *</Label>
                  <Textarea
                    id="adminComments"
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    placeholder={`Rejection Reason...`}
                    rows={4}
                  />
                </div>
              )}

              <div className="space-x-2 absolute bottom-3 right-3">
                <Button
                  onClick={() => handleAction(actionType!, selectedLeave?._id)}
                  disabled={isProcessing}
                  className="cursor-pointer"
                  variant={actionType === "approve" ? "default" : "destructive"}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      {actionType === "approve" ? "Approve" : "Reject"}
                      {actionType === "approve" ? (
                        <FaCheck size={20} />
                      ) : (
                        <FaTrash size={20} />
                      )}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActionSheetOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
