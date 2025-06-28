"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const indianStates = ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat"];
const citiesByState: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Karnataka: ["Bengaluru", "Mysuru"],
  Delhi: ["New Delhi"],
  "Tamil Nadu": ["Chennai", "Coimbatore"],
  Gujarat: ["Ahmedabad", "Surat"],
};

interface Profile {
  name: string;
  fullName?: string;
  gender?: "Male" | "Female" | "Other";
  mobileNumber?: string;
  fullPermanentAddress?: string;
  currentAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

function ProfileForm() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    fullName: "",
    gender: "Male",
    mobileNumber: "",
    fullPermanentAddress: "",
    currentAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/basic-details");
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const {
      name,
      gender,
      mobileNumber,
      fullPermanentAddress,
      currentAddress,
      city,
      state,
      pincode,
    } = profile;

    // Simple validation
    if (!name || !gender || !mobileNumber || !fullPermanentAddress || !currentAddress || !city || !state || !pincode) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile/basic-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile saved!");
      } else {
        toast.error(data.message || "Failed to save profile.");
      }
    } catch (err) {
      console.error("Error submitting profile:", err);
      toast.error("Error submitting profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-8 p-2">
      <CardHeader>
        <CardTitle>Basic Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block">Name<span className="text-red-500">*</span></Label>
          <Input name="name" value={profile.name} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-1 block">Full Name</Label>
          <Input name="fullName" value={profile.fullName || ""} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-1 block">Gender<span className="text-red-500">*</span></Label>
          <Select
            value={profile.gender}
            onValueChange={(val) => setProfile({ ...profile, gender: val as "Male" | "Female" | "Other" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Mobile Number<span className="text-red-500">*</span></Label>
          <Input name="mobileNumber" value={profile.mobileNumber || ""} onChange={handleChange} required />
        </div>
        <div className="col-span-full">
          <Label className="mb-1 block">Full Permanent Address<span className="text-red-500">*</span></Label>
          <Input name="fullPermanentAddress" value={profile.fullPermanentAddress || ""} onChange={handleChange} required />
        </div>
        <div className="col-span-full">
          <Label className="mb-1 block">Current Address<span className="text-red-500">*</span></Label>
          <Input name="currentAddress" value={profile.currentAddress || ""} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-1 block">State<span className="text-red-500">*</span></Label>
          <Select
            value={profile.state}
            onValueChange={(state) =>
              setProfile((prev) => ({
                ...prev,
                state,
                city: "", // Reset city when state changes
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">City<span className="text-red-500">*</span></Label>
          <Select
            value={profile.city}
            onValueChange={(city) => setProfile((prev) => ({ ...prev, city }))}
            disabled={!profile.state}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {(citiesByState[profile.state ?? ""] || []).map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Pincode<span className="text-red-500">*</span></Label>
          <Input name="pincode" value={profile.pincode || ""} onChange={handleChange} required />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProfileForm;
