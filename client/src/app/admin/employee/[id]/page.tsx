"use client";

import React, { use, useEffect, useState } from "react";
import axiosInstance from "../../../../utils/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AiOutlineHome } from "react-icons/ai";
import Link from "next/link";
import dynamic from "next/dynamic";

const Inputbox = dynamic(() => import("../../../../components/Inputbox"));
const Button = dynamic(() => import("../../../../components/Button"));
const Selectbox = dynamic(() => import("../../../../components/Selectbox"));

interface SocialMedia {
  linkedin: string;
  github: string;
  twitter: string;
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  address?: string;
  designation?: string;
  contact?: string;
  department?: string;
  emergencyContact?: string;
  employeeId?: string;
  joiningDate?: string; // ISO string
  dob?: string; // ISO string
  mfaEnabled?: boolean;
  socialMedia?: SocialMedia;
  profilePhoto?: string;
}


const allDepartment = [
  { label: "Choose Department", value: "" },
  { label: "Software Development", value: "Software Development" },
  { label: "QA", value: "QA" },
  { label: "DevOps", value: "DevOps" },
  { label: "Design", value: "Design" },
  { label: "Sales & Marketing", value: "Sales & Marketing" },
];

interface Params {
  id?: string
}

interface HandlerProps {
  params: Promise<Params>
}

const EmployeeSlug = ({ params }: HandlerProps) => {
  const { id } = use(params);
  const [user, setUser] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Record<string, string>>({});

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [emergencyContact, setEmergencyContact] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [joiningDate, setJoiningDate] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    linkedin: "",
    github: "",
    twitter: "",
  });
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`../../api/employee/${id}`, {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json()

        if (data.success) {
          setUser(data.data)
        } else {
          if (data?.message?.server) toast.error(data?.message.server);
        }
      } catch (error: any) {
        console.log(error)
        toast.error("Something wrong")
      } finally {
        setIsLoading(false)
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
      setAddress(user.address || "");
      setDesignation(user.designation || "");
      setContact(user.contact || "");
      setDepartment(user.department || "");
      setEmergencyContact(user.emergencyContact || "");
      setEmployeeId(user.employeeId || "");
      setJoiningDate(user.joiningDate?.slice(0, 10) || "");
      setDob(user.dob?.slice(0, 10) || "");
      setProfilePhoto(user.profilePhoto || "");
      setMfaEnabled(user.mfaEnabled || false);
      setSocialMedia(user.socialMedia || { linkedin: "", github: "", twitter: "" });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setError({});
    setUpdating(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("designation", designation);
    formData.append("contact", contact);
    formData.append("emergencyContact", emergencyContact);
    formData.append("employeeId", employeeId);
    formData.append("department", department);
    formData.append("joiningDate", joiningDate);
    formData.append("dob", dob);
    formData.append("mfaEnabled", mfaEnabled ? "true" : "false");
    formData.append("socialMedia", JSON.stringify(socialMedia));

    if (newProfilePhoto) {
      formData.append("profilePhoto", newProfilePhoto);
    }

    try {
      const response = await axiosInstance.put<{ user: Employee; message: string }>(
        `/employee/${id}`,
        formData
      );
      setUser(response.data.user);
      toast.success(response.data.message);
      router.push("/admin/employee");
    } catch (err: any) {
      const message = err.response?.data?.message;
      if (message?.server) {
        toast.error(message.server);
      }
      setError(message || {});
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-10 text-gray-500">
        Loading employee data...
      </div>
    );
  }

  return (
    <div className="flex-1 py-10 px-4">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center text-sm text-gray-500">
          <AiOutlineHome className="w-4 h-4 mr-1" />
          <Link href={"/admin/dashboard"} className="cursor-pointer hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={"/admin/employee"} className="cursor-pointer hover:underline">
            Employee
          </Link>
          <span className="mx-2">/</span>
          <span className="text-purple-600 font-medium">{user?.name}</span>
        </div>
      </div>
      <div className="w-full border border-gray-200 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Update Profile</h2>

        <div className="flex justify-center mb-4">
          <label htmlFor="profilePhoto" className="cursor-pointer">
            <img
              src={
                newProfilePhoto
                  ? URL.createObjectURL(newProfilePhoto)
                  : profilePhoto ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              className="w-24 h-24 object-cover rounded-full"
              alt="Profile"
            />
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewProfilePhoto(e.target.files[0]);
                }
              }}
              className="hidden"

            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Inputbox label="Name" value={name} setValue={setName} error={error?.name} />
          <Inputbox label="Email" value={email} readOnly={true} error={error?.email} setValue={setEmail} />
          <Inputbox
            label="Date of Birth"
            type="date"
            value={dob}
            setValue={setDob}
            error={error?.dob}

          />
          <Inputbox label="Contact" value={contact} setValue={setContact} error={error?.contact} />
          <Inputbox
            label="Emergency Contact"
            value={emergencyContact}
            setValue={setEmergencyContact}
            error={error?.emergencyContact}

          />
          <Inputbox label="Address" value={address} setValue={setAddress} error={error?.address} />

          <Inputbox label="Employee ID" value={employeeId} readOnly={true} setValue={setEmployeeId} />
          <Selectbox
            label="Department"
            options={allDepartment}
            value={department}
            setValue={setDepartment}
            error={error?.department}

          />
          <Inputbox
            label="Designation"
            value={designation}
            setValue={setDesignation}
            error={error?.designation}

          />
          <Inputbox
            label="Joining Date"
            type="date"
            value={joiningDate}
            setValue={setJoiningDate}
            error={error?.joiningDate}

          />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Social Media</h3>
        <div className="grid grid-cols-2 gap-5">
          {["github", "linkedin", "twitter"].map((key) => (
            <Inputbox
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={socialMedia[key as keyof SocialMedia]}
              setValue={(val) =>
                setSocialMedia({ ...socialMedia, [key]: val })
              }
              placeholder={`${key} URL`}

            />
          ))}
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <span className="font-medium">Two-Step Auth:</span>
          <button
            onClick={() => setMfaEnabled(true)}
            className={`px-3 py-1 rounded ${mfaEnabled ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}

          >
            On
          </button>
          <button
            onClick={() => setMfaEnabled(false)}
            className={`px-3 py-1 rounded ${!mfaEnabled ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}

          >
            Off
          </button>
        </div>

        <div className="mt-10">
          <Button
            onClick={handleUpdateProfile}
            label="Update Profile"
            loading={updating}
            loadLabel="Updating.."
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSlug;
