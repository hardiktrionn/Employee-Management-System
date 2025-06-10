import { Skeleton } from "@/components/ui/skeleton"

export default function TableSkeleton() {
  return (
    <div className="p-6 max-w-full mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <div className="w-80">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b">
          <div className="grid grid-cols-6 gap-4 p-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y">
          {/* Row 1 */}
          <div className="grid grid-cols-6 gap-4 p-4 items-center">
            {/* Name with Avatar */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Email */}
            <Skeleton className="h-6 w-40 rounded-full" />

            {/* Employee ID */}
            <Skeleton className="h-6 w-16 rounded-full" />

            {/* Total Working Days */}
            <Skeleton className="h-4 w-8" />

            {/* Avg Working Hours */}
            <Skeleton className="h-4 w-12" />

            {/* Action */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-6 gap-4 p-4 items-center">
            {/* Name with Avatar */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Email */}
            <Skeleton className="h-6 w-32 rounded-full" />

            {/* Employee ID */}
            <Skeleton className="h-6 w-16 rounded-full" />

            {/* Total Working Days */}
            <Skeleton className="h-4 w-4" />

            {/* Avg Working Hours */}
            <Skeleton className="h-4 w-4" />

            {/* Action */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Row 3 - Additional skeleton row */}
          <div className="grid grid-cols-6 gap-4 p-4 items-center">
            {/* Name with Avatar */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Email */}
            <Skeleton className="h-6 w-36 rounded-full" />

            {/* Employee ID */}
            <Skeleton className="h-6 w-16 rounded-full" />

            {/* Total Working Days */}
            <Skeleton className="h-4 w-6" />

            {/* Avg Working Hours */}
            <Skeleton className="h-4 w-10" />

            {/* Action */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Row 4 - Additional skeleton row */}
          <div className="grid grid-cols-6 gap-4 p-4 items-center">
            {/* Name with Avatar */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-18" />
            </div>

            {/* Email */}
            <Skeleton className="h-6 w-44 rounded-full" />

            {/* Employee ID */}
            <Skeleton className="h-6 w-16 rounded-full" />

            {/* Total Working Days */}
            <Skeleton className="h-4 w-8" />

            {/* Avg Working Hours */}
            <Skeleton className="h-4 w-14" />

            {/* Action */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Row 5 - Additional skeleton row */}
          <div className="grid grid-cols-6 gap-4 p-4 items-center">
            {/* Name with Avatar */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-22" />
            </div>

            {/* Email */}
            <Skeleton className="h-6 w-38 rounded-full" />

            {/* Employee ID */}
            <Skeleton className="h-6 w-16 rounded-full" />

            {/* Total Working Days */}
            <Skeleton className="h-4 w-6" />

            {/* Avg Working Hours */}
            <Skeleton className="h-4 w-12" />

            {/* Action */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
