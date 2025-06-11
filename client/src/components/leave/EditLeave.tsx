import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IoAlertCircleOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { FaCalendarAlt, FaRegClock } from "react-icons/fa";
import { Button } from "../ui/button";
import formatISODate from "@/utils/formatISODate";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Select } from "../ui/select";
import { Leave, setLeave } from "@/redux/leaveSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { calculateDays } from "@/utils/calculateDays";

interface ErrorHandler {
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  server?: string;
  dateRange?: string;
}

interface EditLeaveProps {
  editSheetOpen: boolean;
  setEditSheetOpen: Function;
  selectedLeave: Leave | null;
}

const EditLeave = ({
  editSheetOpen,
  setEditSheetOpen,
  selectedLeave,
}: EditLeaveProps) => {
  const [leaveType, setLeaveType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorHandler>({});
  const { leave } = useSelector((state: RootState) => state.leave);
  const dispatch = useDispatch();

  // update the state see details
  useEffect(() => {
    if (selectedLeave) {
      setLeaveType(selectedLeave.leaveType);
      setStartDate(new Date(selectedLeave.startDate));
      setEndDate(new Date(selectedLeave.endDate));
      setReason(selectedLeave.reason);
    }
  }, [selectedLeave]);

  // change duration of start and endData change
  useEffect(() => {
    if (startDate && endDate) {
      let res = calculateDays(startDate, endDate);
      setDuration(res);
    }
  }, [startDate, endDate]);

  // Update the leave request
  const handleEditSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch(`../api/leave/edit/${selectedLeave?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveType,
          startDate,
          endDate,
          reason,
          duration,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);

        const updatedLeave: any = leave.map((item) =>
          item._id === selectedLeave?._id
            ? {
                ...item,
                leaveType: leaveType!,
                startDate: startDate!,
                endDate: endDate!,
                duration,
                reason: reason!,
              }
            : item
        );

        dispatch(setLeave(updatedLeave));
        setEditSheetOpen(false);

        setLeaveType("");
        setStartDate(undefined);
        setEndDate(undefined);
        setReason("");
        setDuration(0);
      } else {
        setError(data.message);
        if (data.message?.server) {
          toast.error(data.message?.server);
        }
      }
    } catch (err) { 
      // Unexpected error handling
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Sheet
        open={editSheetOpen}
        onOpenChange={() => setEditSheetOpen(!editSheetOpen)}
      >
        <SheetContent className="sm:max-w-[500px] overflow-y-auto px-5 py-8">
          <SheetHeader>
            <SheetTitle>Edit Leave Request</SheetTitle>
            <SheetDescription>
              Make changes to your leave request
            </SheetDescription>
          </SheetHeader>
          {selectedLeave && (
            <form onSubmit={handleEditSubmit} className="space-y-6 py-6">
              <div className="space-y-3">
                <Label
                  htmlFor="leaveType"
                  className={cn(
                    "text-base font-medium",
                    error.leaveType && "text-destructive"
                  )}
                >
                  Leave Type
                </Label>
                <Select value={leaveType} onValueChange={setLeaveType} required>
                  <SelectTrigger
                    id="leaveType"
                    className={cn(
                      "h-12",
                      error.leaveType && "border-destructive ring-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">🏖️ Vacation</SelectItem>
                    <SelectItem value="sick">🏥 Sick Leave</SelectItem>
                    <SelectItem value="personal">👤 Personal Leave</SelectItem>
                    <SelectItem value="emergency">
                      🚨 Emergency Leave
                    </SelectItem>
                  </SelectContent>
                </Select>
                {error.leaveType && (
                  <p className="text-sm font-medium text-destructive mt-1 flex items-center gap-1">
                    <IoAlertCircleOutline className="h-3 w-3" />
                    {error.leaveType}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  className={cn(
                    "text-base font-medium",
                    error.startDate && "text-destructive"
                  )}
                >
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                        error.startDate && "border-destructive text-destructive"
                      )}
                    >
                      <FaCalendarAlt className="mr-3 h-5 w-5" />
                      {startDate ? formatISODate(startDate.toDateString()) : ""}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                    />
                  </PopoverContent>
                </Popover>
                {error.startDate && (
                  <p className="text-sm font-medium text-destructive mt-1 flex items-center gap-1">
                    <IoAlertCircleOutline className="h-3 w-3" />
                    {error.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  className={cn(
                    "text-base font-medium",
                    error.endDate && "text-destructive"
                  )}
                >
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                        (error.endDate || error.dateRange) &&
                          "border-destructive text-destructive"
                      )}
                    >
                      <FaCalendarAlt className="mr-3 h-5 w-5" />
                      {endDate ? formatISODate(endDate.toDateString()) : "-"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
                {error.endDate && (
                  <p className="text-sm font-medium text-destructive mt-1 flex items-center gap-1">
                    <IoAlertCircleOutline className="h-3 w-3" />
                    {error.endDate}
                  </p>
                )}
              </div>

              {startDate && endDate && !error.dateRange && (
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FaRegClock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Duration:</span>
                      <Badge variant="secondary" className="font-medium">
                        {duration} {duration === 1 ? "day" : "days"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <Label
                  htmlFor="editReason"
                  className={cn(
                    "text-base font-medium",
                    error.reason && "text-destructive"
                  )}
                >
                  Reason
                </Label>
                <Textarea
                  id="editReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a detailed reason for your leave request..."
                  rows={5}
                  className={cn(
                    "resize-none",
                    error.reason &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  required
                />
                {error.reason && (
                  <p className="text-sm font-medium text-destructive mt-1 flex items-center gap-1">
                    <IoAlertCircleOutline className="h-3 w-3" />
                    {error.reason}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditSheetOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditLeave;
