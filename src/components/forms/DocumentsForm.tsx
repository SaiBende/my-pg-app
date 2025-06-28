"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

type DocumentField = "idProof" | "addressProof" | "passportPhoto" | "selfieWithId";

type FileMap = Record<DocumentField, File | null>;
type URLMap = Partial<Record<DocumentField, string>>;

export default function DocumentForm() {
  const [files, setFiles] = useState<FileMap>({
    idProof: null,
    addressProof: null,
    passportPhoto: null,
    selfieWithId: null,
  });

  const [previews, setPreviews] = useState<URLMap>({});
  const [loading, setLoading] = useState(false);
  const [modifiedFields, setModifiedFields] = useState<Set<DocumentField>>(new Set());

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/profile/documents");
        const data = await res.json();
        if (data.success) {
          setPreviews(data.data);
        }
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchDocs();
  }, []);

  const handleFileChange = (field: DocumentField, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));

    setModifiedFields((prev) => {
      const newSet = new Set(prev);
      if (file) {
        newSet.add(field);
      } else {
        newSet.delete(field);
      }
      return newSet;
    });

    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [field]: previewURL }));
    }
  };

  const handleSave = async () => {
    if (modifiedFields.size === 0) {
      toast.info("No changes to save");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    modifiedFields.forEach((field) => {
      const file = files[field];
      if (file) {
        formData.append(field, file);
      }
    });

    try {
      const res = await fetch("/api/profile/documents", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Updated successfully");
        setPreviews(data.data);
        setModifiedFields(new Set());
        setFiles({
          idProof: null,
          addressProof: null,
          passportPhoto: null,
          selfieWithId: null,
        });
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.log("Error uploading files:", error);
      toast.error("Upload error");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label: string, field: DocumentField) => {
    const url = previews[field];
    const isModified = modifiedFields.has(field);

    return (
      <div className="space-y-1">
        <Label className="font-semibold">{label}</Label>
        {url ? (
          <div className="w-28 h-28 relative border rounded-md overflow-hidden">
            {url.endsWith(".pdf") ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline text-blue-600 flex items-center justify-center h-full"
              >
                View PDF
              </a>
            ) : (
              <Image
                src={url}
                alt={field}
                fill
                className="object-cover"
              />
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No document</p>
        )}
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
        />
        {isModified && <p className="text-sm text-green-600">Changed</p>}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Manage Documents</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        {renderField("ID Proof", "idProof")}
        {renderField("Address Proof", "addressProof")}
        {renderField("Passport Photo", "passportPhoto")}
        {renderField("Selfie with ID", "selfieWithId")}
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSave} disabled={loading || modifiedFields.size === 0}>
          {loading ? "Saving..." : modifiedFields.size === 0 ? "No Changes" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
