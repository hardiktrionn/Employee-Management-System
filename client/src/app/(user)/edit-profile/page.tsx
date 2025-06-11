"use client";

import { useEffect, useState, ChangeEvent, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axios";
import { setUser } from "../../../redux/userSlice";
import { RootState, AppDispatch } from "../../../lib/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// Lazy-loaded components
const Inputbox = dynamic(() => import("../../../components/Inputbox"));
const Selectbox = dynamic(() => import("../../../components/Selectbox"));
const Button = dynamic(() => import("../../../components/Button"));

// Social links & error type
interface SocialMedia {
  linkedin: string;
  github: string;
  twitter: string;
}
interface ErrorMessages {
  [key: string]: string;
}

// Department options
const allDepartment = [
  { label: "Choose Department", value: "" },
  { label: "Software Development", value: "Software Development" },
  { label: "QA", value: "QA" },
  { label: "DevOps", value: "DevOps" },
  { label: "Design", value: "Design" },
  { label: "Sales & Marketing", value: "Sales & Marketing" },
];

const EditProfile = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);

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

  // Populate form with user data on load
  useEffect(() => {
    if (user) {
      console.log(user);
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

  // Input change handlers
  const handleFieldChange = (key: keyof typeof formState, value: any) =>
    setFormState((prev) => ({ ...prev, [key]: value }));

  const handleSocialChange = (platform: keyof SocialMedia, value: string) =>
    setFormState((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));

  const handleProfilePhotoChange = useCallback((e) => {
    if (e.target.files?.[0]) setNewProfilePhoto(e.target.files[0]);
  }, []);

  /**
   * user update their profile
   * enable the 2-factor-auth.
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { profilePhoto, ...rest } = formState;
    const formData = new FormData();

    Object.entries({
      ...rest,
      mfaEnabled: formState.mfaEnabled.toString(),
      socialMedia: JSON.stringify(formState.socialMedia),
    }).forEach(([key, value]) => formData.append(key, value));

    formData.append("profilePhoto", newProfilePhoto || profilePhoto);

    try {
      const { data } = await axiosInstance.put(
        "/auth/update-profile",
        formData
      );
      if (data.success) {
        toast.success("Profile updated!");
        dispatch(setUser(data.user));
        router.push("/profile");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || {
        server: "Server error",
      };
      setError(message);
      if (message.server) toast.error(message.server);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    name,
    email,
    dob,
    contact,
    emergencyContact,
    address,
    employeeId,
    department,
    designation,
    joiningDate,
    mfaEnabled,
    profilePhoto,
    socialMedia,
  } = formState;

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center">
      <form
        onSubmit={handleUpdateProfile}
        className="w-full max-w-4xl border p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6">Update Profile</h2>

        {/* Profile photo */}
        <div className="flex justify-center mb-4">
          <label htmlFor="profilePhoto" className="cursor-pointer">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={
                  newProfilePhoto
                    ? URL.createObjectURL(newProfilePhoto)
                    : profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
               
                alt="Profile"
                className="object-cover rounded-full"
              />
            </Avatar>
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Basic fields */}
        <div className="grid grid-cols-2 gap-5">
          <Inputbox
            label="Name"
            value={name}
            setValue={(val) => handleFieldChange("name", val)}
            error={error?.name}
          />
          <Inputbox label="Email" value={email} readOnly setValue={() => {}} />
          <Inputbox
            label="Date of Birth"
            type="date"
            value={dob}
            setValue={(val) => handleFieldChange("dob", val)}
            error={error?.dob}
          />
          <Inputbox
            label="Contact"
            value={contact}
            setValue={(val) => handleFieldChange("contact", val)}
            error={error?.contact}
          />
          <Inputbox
            label="Emergency Contact"
            value={emergencyContact}
            setValue={(val) => handleFieldChange("emergencyContact", val)}
            error={error?.emergencyContact}
          />
          <Inputbox
            label="Address"
            value={address}
            setValue={(val) => handleFieldChange("address", val)}
            error={error?.address}
          />
          <Inputbox
            label="Employee ID"
            value={employeeId}
            readOnly
            setValue={() => {}}
          />
          <Selectbox
            label="Department"
            options={allDepartment}
            value={department}
            setValue={(val) => handleFieldChange("department", val)}
            error={error?.department}
          />
          <Inputbox
            label="Designation"
            value={designation}
            setValue={(val) => handleFieldChange("designation", val)}
            error={error?.designation}
          />
          <Inputbox
            label="Joining Date"
            type="date"
            value={joiningDate}
            setValue={(val) => handleFieldChange("joiningDate", val)}
            error={error?.joiningDate}
          />
        </div>

        {/* Social links */}
        <h3 className="text-xl font-semibold mt-8 mb-4">Social Media</h3>
        <div className="grid grid-cols-2 gap-5">
          {(["github", "linkedin", "twitter"] as (keyof SocialMedia)[]).map(
            (key) => (
              <Inputbox
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={socialMedia[key]}
                setValue={(val) => handleSocialChange(key, val)}
                placeholder={`${key} URL`}
              />
            )
          )}
        </div>

        {/* MFA Toggle */}
        <div className="mt-6 flex items-center space-x-4">
          <span className="font-medium">Two-Step Auth:</span>
          <button
            type="button"
            onClick={() => handleFieldChange("mfaEnabled", true)}
            className={`px-3 py-1 rounded ${
              mfaEnabled ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            On
          </button>
          <button
            type="button"
            onClick={() => handleFieldChange("mfaEnabled", false)}
            className={`px-3 py-1 rounded ${
              !mfaEnabled ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            Off
          </button>
        </div>

        {/* Submit button */}
        <div className="mt-10">
          <Button type="submit" label="Update Profile" loading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
