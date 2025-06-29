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
  const [fetching, setFetching] = useState(true);

  // Fetch current verification status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/verify/status");
        const data = await res.json();
        if (data.success) {
          setStatus(data.data || {});
        } else {
          toast.error("Failed to fetch verification status");
        }
      } catch (err) {
        console.error("Error fetching status:", err);
        toast.error("Error loading verification status.");
      } finally {
        setFetching(false);
      }
    };

    fetchStatus();
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
      console.error("Error sending OTP:", err);
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
      console.error("Error verifying OTP:", err);
      toast.error("Verification failed.");
    } finally {
      setVerifying((prev) => ({ ...prev, [type]: false }));
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-t-transparent border-primary rounded-full animate-spin" />
          <span className="text-sm">Checking verification status...</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8 p-4 sm:p-6">
      <CardHeader>
        <CardTitle>Verify Email & Mobile</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {(["email", "mobile"] as const).map((type) => {
          const isVerified = status[type]?.verified;

          return (
            <div key={type} className="space-y-2">
              <Label className="capitalize">{type} verification</Label>

              {isVerified ? (
                <p className="text-green-600 font-medium">✅ Verified</p>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Enter ${type} OTP`}
                      value={otp[type]}
                      onChange={(e) =>
                        setOtp((prev) => ({ ...prev, [type]: e.target.value }))
                      }
                    />
                    <Button
                      onClick={() => sendOtp(type)}
                      disabled={loading[type]}
                      variant="outline"
                    >
                      {loading[type] ? "Sending..." : "Send OTP"}
                    </Button>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => verifyOtp(type)}
                    disabled={verifying[type]}
                  >
                    {verifying[type] ? "Verifying..." : "Verify"}
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
