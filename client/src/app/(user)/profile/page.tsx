"use client";

import { IoShareSocial, IoLogoGithub } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Button from "../../../components/Button";
import { useSelector } from "react-redux";
import formatISODate from "../../../utils/formatISODate";
import { memo, ReactNode } from "react";
import { RootState } from "../../../lib/store";
import Image from "next/image";
import Loader from "../../../components/Loader";

interface SocialMediaLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

const ProfilePage: React.FC = () => {
  const { user ,isLoading} = useSelector((state: RootState) => state.user);

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

  if(isLoading){
    return <Loader/>
  }
  return (
    <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-20 mx-4 lg:mx-10 mt-10">
      <div className="lg:w-[30%] space-y-10">
        {/* Profile Box */}
        <div className="flex items-start px-8 py-5 space-x-5 border border-gray-200 shadow-sm rounded-2xl shadow-gray-500">
          {profilePhoto ? (
            <Image
              height={80}
              width={80}
              className="w-20 h-20 rounded-full object-cover"
              src={profilePhoto}
              alt={name ? `${name}'s Profile` : "Profile-Photo"}
            />
          ) : (
            <FaUserCircle className="w-20 h-20 text-gray-400" />
          )}
          <div className="space-y-2">
            <h1 className="font-bold text-3xl text-blue-600">{name}</h1>
            <p className="font-semibold text-xl text-gray-700">{designation}</p>
            <p className="font-semibold text-gray-700">{address}</p>
          </div>
        </div>

        {/* Social Profiles */}
        <div className="flex flex-col w-full items-center px-8 py-5 border border-gray-200 shadow-sm rounded-2xl shadow-gray-500">
          <div className="text-blue-600 flex items-center font-bold text-3xl space-x-3 mb-7">
            <IoShareSocial size={30} />
            <p>Social Profiles</p>
          </div>

          <InfoRow icon={<MdEmail />} label="Email" value={email} isLink={false} />
          {socialMedia.github && (
            <InfoRow
              icon={<IoLogoGithub />}
              label="Github"
              value={socialMedia.github}
              isLink={true}
            />
          )}
          {socialMedia.linkedin && (
            <InfoRow
              icon={<FaLinkedinIn />}
              label="Linkedin"
              value={socialMedia.linkedin}
              isLink={true}
            />
          )}
          {socialMedia.twitter && (
            <InfoRow
              icon={<FaTwitter />}
              label="Twitter"
              value={socialMedia.twitter}
              isLink={true}
            />
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="lg:w-[70%] relative">
        <div className="absolute right-2 -top-12 flex space-x-2">
          <Link href="/edit-profile">
            <Button label="Edit Profile" loading={false} loadLabel="" />
          </Link>
          <Link href="/change-password">
            <Button label="Change Password" loading={false} loadLabel="" />
          </Link>
        </div>
        <div className="flex flex-col items-center px-5 md:px-20 py-10 border border-gray-200 shadow-sm rounded-2xl shadow-gray-500">
          <div className="text-blue-600 flex items-center font-bold text-3xl space-x-3 mb-7">
            <FaUserCircle size={34} />
            <p>Personal Details</p>
          </div>

          <InfoRow label="Full Name" value={name} />
          <InfoRow label="Contact" value={contact} />
          <InfoRow label="Emergency Contact" value={emergencyContact} />
          <InfoRow label="Employee Id" value={employeeId} />
          <InfoRow label="Position" value={designation} />
          <InfoRow label="Department" value={department} />
          <InfoRow label="Joining Date" value={formatISODate(joiningDate)} />
          <InfoRow label="Date of Birth" value={formatISODate(dob)} />
          <InfoRow label="Address" value={address} />
        </div>
      </div>
    </div>
  );
};

ProfilePage.displayName = "ProfilePage";

interface InfoRowProps {
  icon?: ReactNode;
  label: string;
  value?: string | ReactNode;
  isLink?: boolean;
}

const InfoRowComponent: React.FC<InfoRowProps> = ({ icon, label, value, isLink = false }) => {
  if (!value) return null;

  const renderValue =
    isLink && typeof value === "string" ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {value}
      </a>
    ) : (
      value
    );

  return (
    <div className="w-full border-b py-3 border-gray-400 flex justify-between items-center space-x-2">
      <div className="flex items-center space-x-1.5 font-bold text-xl">
        {icon && icon}
        <span>{label}</span>
      </div>
      <div className="text-gray-600 font-semibold text-xl text-right">{renderValue}</div>
    </div>
  );
};

InfoRowComponent.displayName = "InfoRow";

const InfoRow = memo(InfoRowComponent);

export default ProfilePage;
