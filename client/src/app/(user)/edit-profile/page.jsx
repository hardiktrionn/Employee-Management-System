"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import Inputbox from "@/components/Inputbox";
import Selectbox from "@/components/Selectbox";
import Button from "@/components/Button";

const EditProfile = () => {
  const { error, isLoading, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [designation, setDesignation] = useState("");
  const [contact, setContact] = useState("");
  const [department, setDepartment] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [dob, setDob] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [socialMedia, setSocialMedia] = useState({
    linkedin: "",
    github: "",
    twitter: "",
  });
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");

  const allDepartment = [
    { label: "Choose Department", value: "" },
    { label: "Software Development", value: "Software Development" },
    { label: "QA", value: "QA" },
    { label: "DevOps", value: "DevOps" },
    { label: "Design", value: "Design" },
    { label: "Sales & Marketing", value: "Sales & Marketing" },
  ];

  // User Data load
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


  // User update theif personal details
  const handleUpdateProfile = async () => {
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
    formData.append("mfaEnabled", mfaEnabled);
    formData.append("socialMedia", JSON.stringify(socialMedia));
    formData.append("profilePhoto", newProfilePhoto || profilePhoto);

    const res = await dispatch(updateProfile(formData));

    if (res?.payload?.success) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl border p-6 rounded-lg shadow-lg">
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
              onChange={(e) => setNewProfilePhoto(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Inputbox label="Name" value={name} setValue={setName} error={error?.name} />
          <Inputbox label="Email" value={email} readOnly />
          <Inputbox label="Date of Birth" type="date" value={dob} setValue={setDob} error={error?.dob} />
          <Inputbox label="Contact" value={contact} setValue={setContact} error={error?.contact} />
          <Inputbox label="Emergency Contact" value={emergencyContact} setValue={setEmergencyContact}  error={error?.emergencyContact}/>
          <Inputbox label="Address" value={address} setValue={setAddress} error={error?.address}/>

          <Inputbox label="Employee ID" value={employeeId} readOnly />
          <Selectbox label="Department" options={allDepartment} value={department} setValue={setDepartment} error={error?.department}/>
          <Inputbox label="Designation" value={designation} setValue={setDesignation} error={error?.designation}/>
          <Inputbox label="Joining Date" type="date" value={joiningDate} setValue={setJoiningDate} error={error?.joiningDate}/>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Social Media</h3>
        <div className="grid grid-cols-2 gap-5">
          {["github", "linkedin", "twitter"].map((key) => (
            <Inputbox
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={socialMedia[key]}
              setValue={(val) => setSocialMedia({ ...socialMedia, [key]: val })}
              placeholder={`${key} URL`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <span className="font-medium">Two-Step Auth:</span>
          <button
            onClick={() => setMfaEnabled(true)}
            className={`px-3 py-1 rounded ${mfaEnabled ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            On
          </button>
          <button
            onClick={() => setMfaEnabled(false)}
            className={`px-3 py-1 rounded ${!mfaEnabled ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            Off
          </button>
        </div>

        <div className="mt-10">
          <Button onClick={handleUpdateProfile} label="Update Profile" loading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
