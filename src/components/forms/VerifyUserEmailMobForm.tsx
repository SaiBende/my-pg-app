"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type VerificationStatus = {
  email?: { verified: boolean };
  mobile?: { verified: boolean };
};

export default function VerifyUserEmailMobForm() {
  const [status, setStatus] = useState<VerificationStatus>({});
  const [otp, setOtp] = useState({ email: "", mobile: "" });
  const [loading, setLoading] = useState({ email: false, mobile: false });
  const [verifying, setVerifying] = useState({ email: false, mobile: false });

  // Fetch current verification status
  useEffect(() => {
    fetch("/api/verify/status")
      .then((res) => res.json())
      .then((data) => setStatus(data.data || {}));
  }, []);

  const sendOtp = async (type: "email" | "mobile") => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const res = await fetch("/api/verify/request", {
        method: "POST",
        body: JSON.stringify({ type }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) toast.success(data.message);
      else toast.error(data.message);
    } catch (err) {
      toast.error("Failed to send OTP.");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const verifyOtp = async (type: "email" | "mobile") => {
    setVerifying((prev) => ({ ...prev, [type]: true }));
    try {
      const res = await fetch("/api/verify/confirm", {
        method: "POST",
        body: JSON.stringify({ type, otp: otp[type] }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setStatus((prev) => ({
          ...prev,
          [type]: { verified: true },
        }));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Verification failed.");
    } finally {
      setVerifying((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Email & Mobile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {["email", "mobile"].map((type) => (
          <div key={type} className="space-y-2">
            <Label className="capitalize">{type} verification</Label>

            {status[type as keyof VerificationStatus]?.verified ? (
              <p className="text-green-600">✔️ Verified</p>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input
                    placeholder={`Enter ${type} OTP`}
                    value={otp[type as "email" | "mobile"]}
                    onChange={(e) =>
                      setOtp((prev) => ({ ...prev, [type]: e.target.value }))
                    }
                  />
                  <Button
                    onClick={() => sendOtp(type as "email" | "mobile")}
                    disabled={loading[type as "email" | "mobile"]}
                    variant="outline"
                  >
                    {loading[type as "email" | "mobile"] ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
                <Button
                  className="w-full"
                  onClick={() => verifyOtp(type as "email" | "mobile")}
                  disabled={verifying[type as "email" | "mobile"]}
                >
                  {verifying[type as "email" | "mobile"]
                    ? "Verifying..."
                    : "Verify"}
                </Button>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
