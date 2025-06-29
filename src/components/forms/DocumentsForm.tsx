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
  const [fetching, setFetching] = useState(true);
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
        console.error("❌ Error fetching documents:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchDocs();
  }, []);

  const handleFileChange = (field: DocumentField, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));

    setModifiedFields((prev) => {
      const newSet = new Set(prev);
      if (file) newSet.add(field);
      else newSet.delete(field);
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
        toast.success("Documents uploaded successfully!");
        setPreviews(data.data); // updated URLs
        setModifiedFields(new Set());
        setFiles({
          idProof: null,
          addressProof: null,
          passportPhoto: null,
          selfieWithId: null,
        });
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error("Error uploading documents");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label: string, field: DocumentField) => {
    const url = previews[field];
    const isModified = modifiedFields.has(field);

    return (
      <div className="space-y-2">
        <Label className="font-semibold">{label}</Label>
        <div className="w-full flex items-center gap-2">
          {url ? (
            <div className="relative w-28 h-28 border rounded-md overflow-hidden shrink-0">
              {url.endsWith(".pdf") ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-full text-blue-600 text-sm underline"
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
            <div className="w-28 h-28 border border-dashed rounded-md flex items-center justify-center text-gray-400 text-xs">
              No file
            </div>
          )}
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                handleFileChange(field, e.target.files?.[0] || null)
              }
            />
            {isModified && (
              <p className="text-sm text-green-600 mt-1">Changed</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-t-transparent border-primary rounded-full animate-spin" />
          <span className="text-sm">Loading document details...</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-8 p-4 sm:p-6">
      <CardHeader>
        <CardTitle>Manage Documents</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {renderField("ID Proof", "idProof")}
        {renderField("Address Proof", "addressProof")}
        {renderField("Passport Photo", "passportPhoto")}
        {renderField("Selfie with ID", "selfieWithId")}
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSave} disabled={loading || modifiedFields.size === 0}>
          {loading
            ? "Saving..."
            : modifiedFields.size === 0
            ? "No Changes"
            : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
