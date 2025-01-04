import * as z from "zod";

export const businessFormSchema = z.object({
  businessName: z.string().min(3).max(100),
  contactUsDetails: z.object({
    indEmail: z.string().email(),
    indCountryCode: z.string().default("+91"),
    indMobileNum: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  }),
  operationalHours: z.record(z.array(z.object({
    open: z.string(),
    close: z.string(),
  }))),
  handle: z.string().min(3).max(30).regex(/^(?![.-])([a-zA-Z0-9.-]+(?! {2,}) ?)$/, "Invalid handle format"),
  title: z.string().optional(),
  desc: z.string().min(1, "Description is required"),
  websiteUrl: z.string().optional(),
  location: z.string(),
  locationCoordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  // socialUrls: z.object({
  //   whatsapp: z.string().url().optional(),
  //   linkedin: z.string().url().optional(),
  //   facebook: z.string().url().optional(),
  //   instagram: z.string().url().optional(),
  //   twitter: z.string().url().optional(),
  // }),
  keywords: z.array(z.string()),
  content: z.record(z.array(z.string())),
});