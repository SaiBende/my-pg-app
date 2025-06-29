"use client"

import BankDetailsForm from '@/components/forms/BankDetailForm'
import DocumentForm from '@/components/forms/DocumentsForm'
import EmergencyContactForm from '@/components/forms/EmergencyContactForm'
import KYCForm from '@/components/forms/KYCForm'
import ProfessionalDetailsForm from '@/components/forms/ProfessionalDetailForm'
import ProfileForm from '@/components/forms/ProfileForm'
import VerifyUserEmailMobForm from '@/components/forms/VerifyUserEmailMobForm'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation'

const steps = [
  { title: "Profile", component: <ProfileForm /> },
  { title: "Professional Details", component: <ProfessionalDetailsForm /> },
  { title: "Emergency Contact", component: <EmergencyContactForm /> },
  { title: "Bank Details", component: <BankDetailsForm /> },
  { title: "Documents", component: <DocumentForm /> },
  { title: "Verify Email & Mobile", component: <VerifyUserEmailMobForm /> },
  { title: "KYC", component: <KYCForm /> },
];

function ProfileFormPage() {
  const [step, setStep] = useState(0);

  const goNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const goPrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const progress = ((step + 1) / steps.length) * 100;
  const router=useRouter();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 justify-center">
      <Progress value={progress} />
      <Card>
        <CardHeader>
          <CardTitle>{steps[step].title}</CardTitle>
        </CardHeader>
        <CardContent>{steps[step].component}</CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={goPrev} disabled={step === 0}>
            Previous
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={goNext}>Next</Button>
          ) : (
            <>
              <Button onClick={() => alert("All steps completed ✅")}>Finish</Button>
              <Button onClick={() => {router.push("/dashboard")}} variant="outline">
                Go To Dashboard
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default ProfileFormPage