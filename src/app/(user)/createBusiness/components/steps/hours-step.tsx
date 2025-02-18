"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";

interface HoursStepProps {
  form: UseFormReturn<BusinessFormData>;
}

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export function HoursStep({ form }: HoursStepProps) {
  const handleToggle = (day: string) => {
    const isOpen = form.watch(`operationalHours.${day}`)?.[0]?.isOpen ?? true;
    form.setValue(`operationalHours.${day}`, [
      {
        isOpen: !isOpen,
        open: isOpen ? "closed" : "",
        close: isOpen ? "closed" : "",
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {DAYS.map((day) => (
        <div key={day} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="capitalize font-medium">{day}</h3>
            <Switch
              checked={
                form.watch(`operationalHours.${day}`)?.[0]?.isOpen ?? true
              }
              onCheckedChange={() => handleToggle(day)}
            />
          </div>
          <div className="space-y-4">
            {form.watch(`operationalHours.${day}`)?.map((_, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-end">
                <FormField
                  control={form.control}
                  name={`operationalHours.${day}.${index}.open`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`operationalHours.${day}.${index}.close`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closing Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
