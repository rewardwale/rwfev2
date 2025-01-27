"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { BusinessFormData } from "@/lib/types/business";
import { Phone, MessageSquare, Globe, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactStepProps {
  form: UseFormReturn<BusinessFormData>;
}

export function ContactStep({ form }: ContactStepProps) {
  const COMMUNICATION_OPTIONS = [
    { value: "PHONE_NUMBER", label: "Call", icon: Phone },
    { value: "WHATSAPP_NUMBER", label: "WhatsApp", icon: MessageSquare },
    { value: "WEBSITE", label: "Website", icon: Globe },
    { value: "EMAIL", label: "Email", icon: Mail },
  ] as const;
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contactUsDetails.indEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address*</FormLabel>
            <FormControl>
              <Input type="email" placeholder="email@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-5 gap-4">
        <FormField
          control={form.control}
          name="contactUsDetails.indCountryCode"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Code*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactUsDetails.indMobileNum"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Mobile Number*</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="1234567890"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="defaultCommunication"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Communication Method*</FormLabel>
            <div className="w-full">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select preferred communication" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COMMUNICATION_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
