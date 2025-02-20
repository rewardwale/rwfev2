"use client";

import { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { BusinessFormData } from "@/lib/types/business";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkUBusinessHandleAvailability } from "@/apis/business";

interface BusinessStepProps {
  form: UseFormReturn<BusinessFormData>;
  onHandleAvailabilityChange: (isAvailable: boolean | null) => void;
  handleAvailability: boolean | null;
}

export function BusinessStep({
  form,
  onHandleAvailabilityChange,
  handleAvailability,
}: BusinessStepProps) {
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);
  const [debouncedHandle, setDebouncedHandle] = useState("");

  useEffect(() => {
    const handle = form.watch("handle");
    const timeoutId = setTimeout(() => {
      if (handle && handle !== debouncedHandle) {
        setDebouncedHandle(handle);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [form.watch("handle"), debouncedHandle]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (debouncedHandle) {
        setIsCheckingHandle(true);
        try {
          const response = await checkUBusinessHandleAvailability(
            debouncedHandle,
            "businessPage",
          );
          onHandleAvailabilityChange(response?.data?.isAvailable ?? false);
        } catch (error) {
          console.error("Error checking handle availability:", error);
          onHandleAvailabilityChange(false);
        } finally {
          setIsCheckingHandle(false);
        }
      } else {
        onHandleAvailabilityChange(null);
      }
    };

    checkAvailability();
  }, [debouncedHandle, onHandleAvailabilityChange]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name*</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your business name"
                maxLength={100}
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, " ");
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="handle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Handle*</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  placeholder="your-business-handle"
                  maxLength={30}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(
                      /[^a-zA-Z0-9._-]/g,
                      "",
                    );
                    field.onChange(value);
                  }}
                  className={cn(
                    "pr-10",
                    handleAvailability === true && "border-green-500",
                    handleAvailability === false && "border-red-500",
                  )}
                />
              </FormControl>
              {field.value && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCheckingHandle ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : handleAvailability === true ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : handleAvailability === false ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : null}
                </div>
              )}
            </div>
            <FormMessage />
            {handleAvailability === false && (
              <p className="text-sm text-red-500 mt-1">
                This handle is already taken
              </p>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title*</FormLabel>
            <FormControl>
              <Input
                placeholder="Business title"
                maxLength={30}
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, " ");
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="desc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description*</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your business (minimum 20 characters)"
                className="resize-none"
                maxLength={1000}
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, " ");
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="websiteURLs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL</FormLabel>
            <FormControl>
              <Input placeholder="your-website.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
