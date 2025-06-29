"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type KYCData = {
  referenceNumber: string;
  isVerifiedByAdmin: boolean;
  verifiedAt?: string;
  createdAt?: string;
};

export default function KYCForm() {
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [loading, setLoading] = useState(false); // submit button
  const [fetching, setFetching] = useState(true); // initial fetch

  useEffect(() => {
    const fetchKYC = async () => {
      try {
        const res = await fetch("/api/profile/kyc");
        const data = await res.json();
        if (data.success) {
          setKycData(data.data);
        } else {
          toast.error("Failed to fetch KYC data");
        }
      } catch (err) {
        console.error("Failed to fetch KYC", err);
        toast.error("Error loading KYC info.");
      } finally {
        setFetching(false);
      }
    };
    fetchKYC();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile/kyc", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("KYC created successfully!");
        setKycData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error submitting KYC:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-t-transparent border-primary rounded-full animate-spin" />
          <span className="text-sm">Checking KYC status...</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8 p-4 sm:p-6">
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {kycData ? (
          <>
            <div>
              <strong>Reference Number:</strong> {kycData.referenceNumber}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              {kycData.isVerifiedByAdmin ? (
                <span className="text-green-600">✅ Verified</span>
              ) : (
                <span className="text-yellow-500">⏳ Pending</span>
              )}
            </div>
            {kycData.verifiedAt && (
              <div>
                <strong>Verified At:</strong>{" "}
                {new Date(kycData.verifiedAt).toLocaleString()}
              </div>
            )}
          </>
        ) : (
          <>
            <p>You have not submitted KYC yet. Click the button below to initiate.</p>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit KYC"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
