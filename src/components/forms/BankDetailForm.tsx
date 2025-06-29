"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branchName?: string;
  accountType: "Savings" | "Current";
}

export default function BankDetailsForm() {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    branchName: "",
    accountType: "Savings",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await fetch("/api/profile/bank-details");
        const data = await res.json();
        if (data.success) {
          setBankDetails(data.data);
        }
      } catch (error) {
        console.error("❌ Error loading bank details", error);
      } finally {
        setFetching(false);
      }
    };

    fetchBankDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { accountHolderName, accountNumber, bankName, ifscCode, accountType } = bankDetails;
    if (!accountHolderName || !accountNumber || !bankName || !ifscCode || !accountType) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile/bank-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankDetails),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Bank details saved successfully!");
      } else {
        toast.error(data.message || "Failed to save bank details.");
      }
    } catch (error) {
      console.error("Error submitting bank details:", error);
      toast.error("Error submitting bank details.");
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
          <span className="text-sm">Loading bank details...</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-4 sm:p-6">
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Account Holder Name<span className="text-red-500">*</span></Label>
          <Input name="accountHolderName" value={bankDetails.accountHolderName} onChange={handleChange} />
        </div>
        <div>
          <Label>Account Number<span className="text-red-500">*</span></Label>
          <Input name="accountNumber" value={bankDetails.accountNumber} onChange={handleChange} />
        </div>
        <div>
          <Label>Bank Name<span className="text-red-500">*</span></Label>
          <Input name="bankName" value={bankDetails.bankName} onChange={handleChange} />
        </div>
        <div>
          <Label>IFSC Code<span className="text-red-500">*</span></Label>
          <Input name="ifscCode" value={bankDetails.ifscCode} onChange={handleChange} />
        </div>
        <div>
          <Label>Branch Name</Label>
          <Input name="branchName" value={bankDetails.branchName || ""} onChange={handleChange} />
        </div>
        <div>
          <Label>Account Type<span className="text-red-500">*</span></Label>
          <Select
            value={bankDetails.accountType}
            onValueChange={(val) =>
              setBankDetails((prev) => ({ ...prev, accountType: val as "Savings" | "Current" }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Savings">Savings</SelectItem>
              <SelectItem value="Current">Current</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Bank Details"}
        </Button>
      </CardFooter>
    </Card>
  );
}
