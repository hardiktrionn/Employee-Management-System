
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { IoMdShare } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton"
import { FaUser } from "react-icons/fa";

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 mx-4 lg:mx-10 mt-10">
      <div className="lg:w-[30%] space-y-10">
        {/* Profile Box Skeleton */}
        <Card className="shadow-md">
          <CardContent className="flex items-start p-8 space-x-5">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </CardContent>
        </Card>

        {/* Social Profiles Skeleton */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="text-primary flex items-center font-bold text-3xl space-x-3">
              <IoMdShare size={30} />
              <p>Social Profiles</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
          </CardContent>
        </Card>
      </div>

      {/* Personal Details Skeleton */}
      <div className="lg:w-[70%] relative">
        <div className="absolute right-2 -top-12 flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <div className="text-primary flex items-center font-bold text-3xl space-x-3">
              <FaUser size={34} />
              <p>Personal Details</p>
            </div>
          </CardHeader>
          <CardContent className="px-5 md:px-20 space-y-4">
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
            <SkeletonInfoRow />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const SkeletonInfoRow = () => {
  return (
    <>
      <div className="w-full py-3 flex justify-between items-center space-x-2">
        <div className="flex items-center space-x-1.5">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="border-b border-gray-200" />
    </>
  )
}

export default ProfileSkeleton
