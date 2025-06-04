"use client";

import { IoShareSocial, IoLogoGithub } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Button from "@/components/Button";
import { useSelector } from "react-redux";
import formatISODate from "@/utils/formatISODate";
import { memo } from "react";

const Homepage = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);

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
    socialMedia = {},
  } = user || {};

  const fallbackImage =
    "https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";

  return (
    <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-20 mx-4 lg:mx-10 mt-10">
      <div className="lg:w-[30%] space-y-10">
        {/* Profile Box */}
        <div className="flex items-start px-8 py-5 space-x-5 border border-gray-200 shadow-sm rounded-2xl shadow-gray-500">
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={profilePhoto || fallbackImage}
            alt="Profile"
          />
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

          <InfoRow icon={<MdEmail />} label="Email" value={email} />
          {socialMedia.github && (
            <InfoRow
              icon={<IoLogoGithub />}
              label="Github"
              value={socialMedia.github}
            />
          )}
          {socialMedia.linkedin && (
            <InfoRow
              icon={<FaLinkedinIn />}
              label="Linkedin"
              value={socialMedia.linkedin}
            />
          )}
          {socialMedia.twitter && (
            <InfoRow
              icon={<FaTwitter />}
              label="Twitter"
              value={socialMedia.twitter}
            />
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="lg:w-[70%] relative">
        <div className="absolute right-2 -top-12">
          <Link href="/edit-profile">
            <Button label="Edit Profile" loading={false} loadLabel="" />
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

const InfoRow = memo(({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="space-y-2 w-full border-b py-3 border-gray-400">
      <div className="flex items-center justify-between relative w-full">
        <div className="flex items-center absolute space-x-1.5 font-bold text-xl">
          {icon && icon}
          <span>{label}</span>
        </div>
        <div className="text-end w-full font-semibold text-xl text-gray-600">
          <span>{value}</span>
        </div>
      </div>
    </div>
  );
});

export default Homepage;
