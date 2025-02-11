"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Business } from "../types/brands";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

const timeSchema = z.object({
  open: z.string(),
  close: z.string(),
});

const operationalHoursSchema = z.object({
  monday: z.array(timeSchema),
  tuesday: z.array(timeSchema),
  wednesday: z.array(timeSchema),
  thursday: z.array(timeSchema),
  friday: z.array(timeSchema),
  saturday: z.array(timeSchema),
  sunday: z.array(timeSchema),
});

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactUsDetails: z.object({
    indEmail: z.string().email("Invalid email address"),
    indCountryCode: z.string(),
    indMobileNum: z.string(),
  }),
  operationalHours: operationalHoursSchema,
  handle: z.string(),
  title: z.string(),
  desc: z.string(),
  websiteURLs: z.array(z.string()).optional(),
  location: z.string(),
  socialUrls: z.object({
    whatsapp: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
  }),
  defaultCommunication: z.string().optional(),
  keywords: z.array(z.string()),
});

interface EditBusinessDialogProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

const COMMUNICATION_OPTIONS = [
  { value: "EMAIL", label: "Email" },
  { value: "PHONE_NUMBER", label: "Phone Number" },
  { value: "WHATSAPP_NUMBER", label: "WhatsApp Number" },
  { value: "WEBSITE", label: "Website" },
];

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export function EditBusinessDialog({
  business,
  isOpen,
  onClose,
  onSubmit,
}: EditBusinessDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: business.businessName,
      contactUsDetails: business.contactUsDetails,
      operationalHours: business.operationalHours,
      handle: business.handle,
      title: business.title,
      desc: business.desc,
      websiteURLs:
        typeof business.websiteURLs === "string"
          ? [business.websiteURLs]
          : business.websiteURLs || [],
      location: business.location,
      socialUrls: business.socialUrls,
      defaultCommunication: business.defaultCommunication,
      keywords: [],
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(data);
      toast.success("Business details updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update business details");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Business Details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="hours">Hours</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[60vh] pr-4">
                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultCommunication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Communication Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select communication method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COMMUNICATION_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactUsDetails.indEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactUsDetails.indCountryCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country Code</FormLabel>
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
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="websiteURLs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={
                              Array.isArray(field.value)
                                ? field.value.join(", ")
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  .split(",")
                                  .map((url) => url.trim())
                                  .filter((url) => url !== ""),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {Object.keys(business.socialUrls).map((platform) => (
                    <FormField
                      key={platform}
                      control={form.control}
                      name={`socialUrls.${platform}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">
                            {platform}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="hours" className="space-y-4">
                  {DAYS.map((day) => (
                    <div key={day} className="space-y-2">
                      <h3 className="font-medium capitalize">{day}</h3>
                      {form.watch(`operationalHours.${day}`).map((_, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`operationalHours.${day}.${index}.open`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Open</FormLabel>
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
                                <FormLabel>Close</FormLabel>
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
                  ))}
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
