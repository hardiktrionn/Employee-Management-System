import React from "react";
import { Card, CardContent } from "../ui/card";
import { FiClock, FiFileText } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface StateLeaveCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}
const StateLeaveCards = ({ stats }:StateLeaveCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FiFileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">
                Total Requests
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <FiClock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-green-500/10">
              <FaCheck className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-red-500/10">
              <IoClose className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StateLeaveCards;
