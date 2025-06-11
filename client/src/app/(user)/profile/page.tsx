"use client";

import { IoShareSocial } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { useSelector } from "react-redux";
import formatISODate from "../../../utils/formatISODate";
import { RootState } from "../../../lib/store";
import Loader from "../../../components/Loader";
import { memo, ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";
import ProfileSkeleton from "@/components/skelton/ProfileSkeleton";

interface SocialMediaLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

const ProfilePage = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.user);

  const {
    name,
    designation,
    address,
    email,
    contact,
    emergencyContact,
    employeeId,
    department,
    joiningDate,
    dob,
    profilePhoto,
    socialMedia = { linkedin: "", github: "", twitter: "" } as SocialMediaLinks,
  } = user || {};

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 mx-4 lg:mx-10 mt-10">
      <div className="lg:w-[30%] space-y-10">
        {/* Profile Box */}
        <Card className="shadow-md">
          <CardContent className="flex items-start p-8 space-x-5">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={profilePhoto || "/placeholder.svg"}
                alt={`${name}'s Profile`}
              />
              <AvatarFallback>
                <FaUser className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="font-bold text-3xl text-primary">{name}</h1>
              <p className="font-semibold text-xl text-muted-foreground">
                {designation}
              </p>
              <p className="font-semibold text-muted-foreground">{address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Profiles */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="text-primary flex items-center font-bold text-3xl space-x-3">
              <IoShareSocial size={30} />
              <p>Social Profiles</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={<MdEmail />} label="Email" value={email} />
            <InfoRow
              icon={<MdEmail />}
              label="Github"
              value={socialMedia.github}
            />
            <InfoRow
              icon={<FaLinkedinIn />}
              label="Linkedin"
              value={socialMedia.linkedin}
            />
            <InfoRow
              icon={<FaTwitter />}
              label="Twitter"
              value={socialMedia.twitter}
            />
          </CardContent>
        </Card>
      </div>

      {/* Personal Details */}
      <div className="lg:w-[70%] relative">
        <div className="absolute right-2 -top-12 flex space-x-2">
          <Link href="/edit-profile">
            <Button>Edit Profile</Button>
          </Link>
          <Link href="/change-password">
            <Button variant="outline">Change Password</Button>
          </Link>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <div className="text-primary flex items-center font-bold text-3xl space-x-3">
              <FaUser size={34} />
              <p>Personal Details</p>
            </div>
          </CardHeader>
          <CardContent className="px-5 md:px-20 space-y-4">
            <InfoRow label="Full Name" value={name} />
            <InfoRow label="Contact" value={contact} />
            <InfoRow label="Emergency Contact" value={emergencyContact} />
            <InfoRow label="Employee Id" value={employeeId} />
            <InfoRow label="Position" value={designation} />
            <InfoRow label="Department" value={department} />
            <InfoRow label="Joining Date" value={formatISODate(joiningDate)} />
            <InfoRow label="Date of Birth" value={formatISODate(dob)} />
            <InfoRow label="Address" value={address} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

ProfilePage.displayName = "ProfilePage";

interface InfoRowProps {
  icon?: ReactNode;
  label: string;
  value?: string;
}

const InfoRowComponent = ({ icon, label, value }: InfoRowProps) => {
  if (!value) return null;
  return (
    <>
      <div className="w-full py-3 flex justify-between items-center space-x-2">
        <div className="flex items-center space-x-1.5 font-bold text-xl">
          {icon && icon}
          <span>{label}</span>
        </div>
        <div className="text-muted-foreground font-semibold text-xl text-right">
          {value}
        </div>
      </div>
      <Separator />
    </>
  );
};

InfoRowComponent.displayName = "InfoRow";

const InfoRow = memo(InfoRowComponent);

export default ProfilePage;
