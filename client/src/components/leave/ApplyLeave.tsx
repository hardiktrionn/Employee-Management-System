"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiAlertCircle, FiClock, FiFileText } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdExitToApp } from "react-icons/md";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { calculateDays } from "@/utils/calculateDays";

interface ErrorHandler {
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  server?: string;
}
export default function LeavePage() {
  const [leaveType, setLeaveType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [error, setError] = useState<ErrorHandler>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const res = await fetch("/api/leave/register-leave", {
        method: "POST",
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
        toast.success(data.message.server);
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
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      let res = calculateDays(startDate, endDate);
      setDuration(res);
    }
  }, [startDate, endDate]);

  return (
    <div className="p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Request For a Leave
          </h1>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-lg  shadow-gray-200 border border-gray-100 bg-gradient-to-br from-background to-muted/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <MdExitToApp className="text-white w-6 h-6" />
                </div>
                Request Leave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="leaveType"
                    className={cn(
                      "text-base font-medium",
                      error?.leaveType && "text-red-600"
                    )}
                  >
                    Leave Type
                  </Label>
                  <Select
                    value={leaveType}
                    onValueChange={setLeaveType}
                    required
                  >
                    <SelectTrigger
                      className={cn(
                        "h-12 text-base w-1/2",
                        error?.leaveType && "border-red-600 ring-red-600"
                      )}
                    >
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent className="w-1/2 text-lg">
                      <SelectItem value="sick">🏥 Sick Leave</SelectItem>
                      <SelectItem value="vacation">🏖️ Vacation</SelectItem>
                      <SelectItem value="personal">
                        👤 Personal Leave
                      </SelectItem>
                      <SelectItem value="emergency">
                        🚨 Emergency Leave
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {error?.leaveType && (
                    <p className="text-sm font-medium text-destructive flex items-center gap-1">
                      <FiAlertCircle className="h-3 w-3" />
                      {error?.leaveType}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      className={cn(
                        "text-base font-medium",
                        error?.startDate && "text-red-600"
                      )}
                    >
                      Start Date
                    </Label>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className={cn(
                          "h-12 text-base w-1/2",
                          error?.startDate && "border-red-600 ring-red-600"
                        )}
                      >
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal text-base",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <FaRegCalendarAlt className="mr-3 h-5 w-5" />
                          {startDate
                            ? format(startDate, "dd-MM-yyyy")
                            : "dd-mm-yyyy"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate ?? undefined}
                          onSelect={setStartDate}
                          disabled={(date) => date < new Date()}
                      
                        />
                      </PopoverContent>
                    </Popover>
                    {error?.startDate && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-1">
                        <FiAlertCircle className="h-3 w-3" />
                        {error?.startDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label
                      className={cn(
                        "text-base font-medium",
                        error?.endDate && "text-red-600"
                      )}
                    >
                      End Date
                    </Label>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className={cn(
                          "h-12 text-base w-1/2",
                          error?.endDate && "border-red-600 ring-red-600"
                        )}
                      >
                        <Button
                          variant="outline"
                          disabled={isLoading}
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal text-base",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <FaRegCalendarAlt className="mr-3 h-5 w-5" />
                          {endDate
                            ? format(endDate, "dd-MM-yyyy")
                            : "dd-mm-yyyy"}
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
                    {error?.endDate && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-1">
                        <FiAlertCircle className="h-3 w-3" />
                        {error?.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {startDate && endDate && (
                  <Card className="bg-muted/50 border-dashed">
                    <CardContent className="px-5 py-0">
                      <div className="flex items-center gap-2 text-sm">
                        <FiClock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Duration:</span>
                        <Badge variant="secondary" className="font-medium">
                          {duration} {duration === 1 ? "day" : "days"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  <Label htmlFor="reason" className="text-base font-medium">
                    Reason
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide a detailed reason for your leave request..."
                    rows={5}
                    className={cn(
                      "h-12 text-base resize-none w-1/2",
                      error?.leaveType && "border-red-600 ring-red-600"
                    )}
                    required
                  />
                  {error?.reason && (
                    <p className="text-sm font-medium text-destructive flex items-center gap-1">
                      <FiAlertCircle className="h-3 w-3" />
                      {error?.reason}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                >
                  <FiFileText className="mr-2 h-5 w-5" />
                  Submit Leave Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
