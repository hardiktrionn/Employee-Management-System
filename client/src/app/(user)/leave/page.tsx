"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageLeave from "@/components/leave/ManageLeave";
import ApplyLeave from "@/components/leave/ApplyLeave";

import { MdCalendarToday } from "react-icons/md";
import { FiFileText } from "react-icons/fi";

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState<string>("manage");

  return (
    <div className="p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <FiFileText className="w-4 h-4" />
              apply Leave
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <MdCalendarToday className="w-4 h-4" />
              Manage Leaves
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manage" className="space-y-6">
            <ManageLeave />
          </TabsContent>
          <TabsContent value="apply" className="space-y-6">
            <ApplyLeave />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
