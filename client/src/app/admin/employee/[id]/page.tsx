"use client";

import React, { use, useEffect, useState } from "react";
import axiosInstance from "../../../../utils/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AiOutlineHome } from "react-icons/ai";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamic components
const Inputbox = dynamic(() => import("../../../../components/Inputbox"));
const Button = dynamic(() => import("../../../../components/Button"));
const Selectbox = dynamic(() => import("../../../../components/Selectbox"));

interface SocialMedia {
  linkedin: string;
  github: string;
  twitter: string;
}

// Static department
const departments = [
  { label: "Choose Department", value: "" },
  { label: "Software Development", value: "Software Development" },
  { label: "QA", value: "QA" },
  { label: "DevOps", value: "DevOps" },
  { label: "Design", value: "Design" },
  { label: "Sales & Marketing", value: "Sales & Marketing" },
];

const EmployeeSlug = ({ params }: { params: Promise<{ id?: string }> }) => {
  const { id } = use(params);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<any>({});
  const [formState, setFormState] = useState({
    email: "",
    name: "",
    address: "",
    designation: "",
    contact: "",
    department: "",
    emergencyContact: "",
    employeeId: "",
    joiningDate: "",
    dob: "",
    mfaEnabled: false,
    profilePhoto: "",
    socialMedia: { linkedin: "", github: "", twitter: "" } as SocialMedia,
  });
  const [social, setSocial] = useState({
    linkedin: "",
    github: "",
    twitter: "",
  });
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  // fetch the employee throw theif id
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`../../api/employee/user/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUser(data.data);
        else toast.error(data?.message?.server);
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEmployee();
  }, [id]);

  // update the form State if employee change
  useEffect(() => {
    if (user) {
      setFormState({
        email: user.email || "",
        name: user.name || "",
        address: user.address || "",
        designation: user.designation || "",
        contact: user.contact || "",
        department: user.department || "",
        emergencyContact: user.emergencyContact || "",
        employeeId: user.employeeId || "",
        joiningDate: user.joiningDate?.slice(0, 10) || "",
        dob: user.dob?.slice(0, 10) || "",
        profilePhoto: user.profilePhoto || "",
        mfaEnabled: user.mfaEnabled || false,
        socialMedia: user.socialMedia || {
          linkedin: "",
          github: "",
          twitter: "",
        },
      });
    }
  }, [user]);

  // update employee profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError({});

    const { profilePhoto, ...rest } = formState;
    const formData = new FormData();

    Object.entries({
      ...rest,
      mfaEnabled: formState.mfaEnabled.toString(),
      socialMedia: JSON.stringify(formState.socialMedia),
    }).forEach(([key, value]) => formData.append(key, value));

    if (newPhoto) formData.append("profilePhoto", newPhoto);

    try {
      const res = await axiosInstance.put(`/employee/${id}`, formData);
      toast.success(res.data.message);
      router.push("/admin/employee");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg?.server) toast.error(msg.server);
      setError(msg || {});
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full p-10 text-gray-500">
        Loading employee data...
      </div>
    );

  return (
    <div className="flex-1 py-10 px-4">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center text-sm text-gray-500">
          <AiOutlineHome className="w-4 h-4 mr-1" />
          <Link href="/admin/dashboard" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/admin/employee" className="hover:underline">
            Employee
          </Link>
          <span className="mx-2">/</span>
          <span className="text-purple-600 font-medium">{user?.name}</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full border p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6">Update Profile</h2>

        <div className="flex justify-center mb-4">
          <label htmlFor="profilePhoto" className="cursor-pointer">
            <Image
              height={80}
              width={80}
              className="w-24 h-24 object-cover rounded-full"
              src={
                newPhoto
                  ? URL.createObjectURL(newPhoto)
                  : profilePhoto ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
            />
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0])
                  setNewPhoto(e.target.files[0]);
              }}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Inputbox
            label="Name"
            value={formState.name || ""}
            setValue={(val) => setFormState({ ...formState, name: val })}
            error={error?.name}
          />
          <Inputbox
            label="Email"
            value={formState.email || ""}
            readOnly={true}
            setValue={() => {}}
            error={error?.email}
          />
          <Inputbox
            label="Date of Birth"
            type="date"
            value={formState.dob?.slice(0, 10) || ""}
            setValue={(val) => setFormState({ ...formState, dob: val })}
            error={error?.dob}
          />
          <Inputbox
            label="Contact"
            value={formState.contact || ""}
            setValue={(val) => setFormState({ ...formState, contact: val })}
            error={error?.contact}
          />
          <Inputbox
            label="Emergency Contact"
            value={formState.emergencyContact || ""}
            setValue={(val) =>
              setFormState({ ...formState, emergencyContact: val })
            }
            error={error?.emergencyContact}
          />
          <Inputbox
            label="Address"
            value={formState.address || ""}
            setValue={(val) => setFormState({ ...formState, address: val })}
            error={error?.address}
          />
          <Inputbox
            label="Employee ID"
            value={formState.employeeId || ""}
            readOnly={true}
            setValue={() => {}}
          />
          <Selectbox
            label="Department"
            options={departments}
            value={formState.department || ""}
            setValue={(val) => setFormState({ ...formState, department: val })}
            error={error?.department}
          />
          <Inputbox
            label="Designation"
            value={formState.designation || ""}
            setValue={(val) => setFormState({ ...formState, designation: val })}
            error={error?.designation}
          />
          <Inputbox
            label="Joining Date"
            type="date"
            value={formState.joiningDate?.slice(0, 10) || ""}
            setValue={(val) => setFormState({ ...formState, joiningDate: val })}
            error={error?.joiningDate}
          />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Social Media</h3>
        <div className="grid grid-cols-2 gap-5">
          {["github", "linkedin", "twitter"].map((key) => (
            <Inputbox
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={social[key as keyof typeof social] || ""}
              setValue={(val) => setSocial({ ...social, [key]: val })}
              placeholder={`${key} URL`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <span className="font-medium">Two-Step Auth:</span>
          <button
            onClick={() => setMfaEnabled(true)}
            type="button"
            className={`px-3 py-1 rounded ${
              mfaEnabled ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            On
          </button>
          <button
            onClick={() => setMfaEnabled(false)}
            type="button"
            className={`px-3 py-1 rounded ${
              !mfaEnabled ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            Off
          </button>
        </div>

        <div className="mt-10">
          <Button
            type="submit"
            label="Update Profile"
            loading={updating}
            loadLabel="Updating.."
          />
        </div>
      </form>
    </div>
  );
};

export default EmployeeSlug;
