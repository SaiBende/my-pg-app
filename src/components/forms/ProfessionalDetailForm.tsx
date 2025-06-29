"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

type CollegeDetails = {
  name?: string;
  course?: string;
  yearOfStudy?: string;
  rollNumber?: string;
  address?: string;
};

type WorkDetails = {
  companyName?: string;
  designation?: string;
  employeeId?: string;
  experienceYears?: string;
  officeAddress?: string;
};

type ProfessionalDetails = {
  professionalStatus: "College Student" | "Working Professional";
  college: CollegeDetails;
  work: WorkDetails;
};

export default function ProfessionalDetailsForm() {
  const [details, setDetails] = useState<ProfessionalDetails>({
    professionalStatus: "College Student",
    college: {},
    work: {},
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await fetch("/api/profile/professional-details");
      const data = await res.json();
      if (data.success) {
        setDetails(data.data);
      }
    } catch (err) {
      console.error("❌ Error fetching:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: "college" | "work"
  ) => {
    const { name, value } = e.target;
    if (section) {
      setDetails((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile/professional-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Professional details saved!");
      } else {
        toast.error(data.message || "Failed to save.");
      }
    } catch (err) {
      console.error("❌ Submission error:", err);
      toast.error("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4 py-8 sm:min-h-[60vh]">
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <div className="h-5 w-5 border-2 border-t-transparent border-primary rounded-full animate-spin" />
          <span className="text-sm">Loading professional details...</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-8 p-4 sm:p-6">
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-full">
          <Label className="mb-1 block">
            Professional Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={details.professionalStatus}
            onValueChange={(val) =>
              setDetails({
                ...details,
                professionalStatus:
                  val as "College Student" | "Working Professional",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="College Student">College Student</SelectItem>
              <SelectItem value="Working Professional">Working Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {details.professionalStatus === "College Student" && (
          <>
            <div className="col-span-full">
              <Label className="mb-1 block">College Name <span className="text-red-500">*</span></Label>
              <Input name="name" value={details.college?.name || ""} onChange={(e) => handleChange(e, "college")} />
            </div>
            <div>
              <Label className="mb-1 block">Course <span className="text-red-500">*</span></Label>
              <Input name="course" value={details.college?.course || ""} onChange={(e) => handleChange(e, "college")} />
            </div>
            <div>
              <Label className="mb-1 block">Year of Study <span className="text-red-500">*</span></Label>
              <Input name="yearOfStudy" value={details.college?.yearOfStudy || ""} onChange={(e) => handleChange(e, "college")} />
            </div>
            <div>
              <Label className="mb-1 block">Roll Number <span className="text-red-500">*</span></Label>
              <Input name="rollNumber" value={details.college?.rollNumber || ""} onChange={(e) => handleChange(e, "college")} />
            </div>
            <div className="col-span-full">
              <Label className="mb-1 block">College Address <span className="text-red-500">*</span></Label>
              <Input name="address" value={details.college?.address || ""} onChange={(e) => handleChange(e, "college")} />
            </div>
          </>
        )}

        {details.professionalStatus === "Working Professional" && (
          <>
            <div>
              <Label className="mb-1 block">Company Name <span className="text-red-500">*</span></Label>
              <Input name="companyName" value={details.work?.companyName || ""} onChange={(e) => handleChange(e, "work")} />
            </div>
            <div>
              <Label className="mb-1 block">Designation <span className="text-red-500">*</span></Label>
              <Input name="designation" value={details.work?.designation || ""} onChange={(e) => handleChange(e, "work")} />
            </div>
            <div>
              <Label className="mb-1 block">Employee ID <span className="text-red-500">*</span></Label>
              <Input name="employeeId" value={details.work?.employeeId || ""} onChange={(e) => handleChange(e, "work")} />
            </div>
            <div>
              <Label className="mb-1 block">Years of Experience <span className="text-red-500">*</span></Label>
              <Input type="number" name="experienceYears" value={details.work?.experienceYears || ""} onChange={(e) => handleChange(e, "work")} />
            </div>
            <div className="col-span-full">
              <Label className="mb-1 block">Office Address <span className="text-red-500">*</span></Label>
              <Input name="officeAddress" value={details.work?.officeAddress || ""} onChange={(e) => handleChange(e, "work")} />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
