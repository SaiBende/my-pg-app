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
  const [loading, setLoading] = useState(false);

  // Fetch KYC status on mount
  useEffect(() => {
    const fetchKYC = async () => {
      try {
        const res = await fetch("/api/profile/kyc");
        const data = await res.json();
        if (data.success) {
          setKycData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch KYC");
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
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {kycData ? (
          <>
            <p>
              <strong>Reference Number:</strong> {kycData.referenceNumber}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {kycData.isVerifiedByAdmin ? (
                <span className="text-green-600">✅ Verified</span>
              ) : (
                <span className="text-yellow-500">⏳ Pending</span>
              )}
            </p>
            {kycData.verifiedAt && (
              <p>
                <strong>Verified At:</strong>{" "}
                {new Date(kycData.verifiedAt).toLocaleString()}
              </p>
            )}
          </>
        ) : (
          <>
            <p>
              You have not submitted KYC yet. Click the button below to initiate.
            </p>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit KYC"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
