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
import { Business, BusinessHours, BusinessPage } from "../types/brands";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Upload, UserCircle2, X } from "lucide-react";
import { setProfilePicture, uploadBusinessProfile } from "@/apis/business";

const timeSchema = z.object({
  open: z.string(),
  close: z.string(),
  isOpen: z.boolean(),
  // _id: z.string().optional(),
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

type FormValues = z.infer<typeof formSchema>;
type Day = (typeof DAYS)[number];

interface EditBusinessDialogProps {
  business: BusinessPage;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
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

  const handleSubmit = async (data: FormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDayToggle = (day: Day, value: boolean) => {
    const currentHours = form.getValues(
      `operationalHours.${day}`,
    ) as BusinessHours[];
    const updatedHours = currentHours.map((hour) => ({
      ...hour,
      isOpen: value,
    }));
    form.setValue(`operationalHours.${day}` as const, updatedHours);
  };

  const handlePhotoUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadBusinessProfile(business._id, formData);
      if (response.message === "Success.") {
        toast.success("Photo uploaded successfully");
      } else {
        toast.error("Failed to upload photo");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetProfilePicture = async (imageId: string) => {
    try {
      const response = await setProfilePicture(business._id, imageId);
      if (response.message === "Success.") {
        toast.success("Profile picture updated successfully");
        window.location.reload()
      } else {
        toast.error("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error setting profile picture:", error);
      toast.error("Failed to update profile picture");
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="hours">Hours</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
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
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium capitalize">{day}</h3>
                        <FormField
                          control={form.control}
                          name={`operationalHours.${day}.0.isOpen` as const}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                    handleDayToggle(day, value);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">
                                {field.value ? "Open" : "Closed"}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      {form.watch(
                        `operationalHours.${day}.0.isOpen` as const,
                      ) &&
                        form
                          .watch(`operationalHours.${day}`)
                          .map((_, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={
                                  `operationalHours.${day}.${index}.open` as const
                                }
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
                                name={
                                  `operationalHours.${day}.${index}.close` as const
                                }
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

                <TabsContent value="photos" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Business Photos</h3>
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Add Photo"}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {business.businessImages.map((image, index) => (
                        <div key={image._id} className="relative group">
                          <img
                            src={image.original}
                            alt={`Business photo ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                              transition-opacity rounded-lg flex items-center justify-center gap-2"
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleSetProfilePicture(image._id)}
                            >
                              <UserCircle2 className="h-4 w-4 mr-1" />
                              Set as Profile
                            </Button>
                            {/* <Button
                              variant="destructive"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                toast.error("Photo deletion not implemented");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button> */}
                          </div>
                          {business._id === image._id && (
                            <div
                              className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1
                                rounded-full"
                            >
                              Profile PicturedefaultBusinessBanner
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {business.businessImages.length === 0 && (
                      <div
                        className="border-2 border-dashed rounded-lg p-8 text-center"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            No photos yet. Click to upload your first photo.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
