"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface EmergencyContact {
  contactName: string;
  relationship: string;
  mobileNumber: string;
  address?: string;
}

export default function EmergencyContactForm() {
  const [contact, setContact] = useState<EmergencyContact>({
    contactName: "",
    relationship: "",
    mobileNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/profile/emergency-contact-details");
        const data = await res.json();
        if (data.success) {
          setContact(data.data);
        }
      } catch (error) {
        console.error("❌ Error loading contact", error);
      } finally {
        setFetching(false);
      }
    };

    fetchContact();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!contact.contactName || !contact.relationship || !contact.mobileNumber) {
      return toast.error("Please fill in all required fields.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile/emergency-contact-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Emergency contact saved successfully!");
      } else {
        toast.error(data.message || "Failed to save contact.");
      }
    } catch (error) {
      console.error("❌ Error submitting contact:", error);
      toast.error("Error submitting contact.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Responsive loading UI
  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4 py-8 sm:min-h-[60vh]">
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <div className="h-5 w-5 border-2 border-t-transparent border-primary rounded-full animate-spin" />
          <span className="text-sm">Loading contact details...</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-4 sm:p-6">
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block">
            Contact Name<span className="text-red-500">*</span>
          </Label>
          <Input name="contactName" value={contact.contactName} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-1 block">
            Relationship<span className="text-red-500">*</span>
          </Label>
          <Input name="relationship" value={contact.relationship} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-1 block">
            Mobile Number<span className="text-red-500">*</span>
          </Label>
          <Input name="mobileNumber" value={contact.mobileNumber} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-1 block">Address</Label>
          <Input name="address" value={contact.address || ""} onChange={handleChange} />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Contact"}
        </Button>
      </CardFooter>
    </Card>
  );
}
