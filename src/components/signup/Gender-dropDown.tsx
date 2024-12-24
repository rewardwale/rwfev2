import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
}
// Zod Schema for Gender
export const GenderSchema = z.enum(["male", "female", "others"], {
  required_error: "Please select a gender",
  invalid_type_error: "Gender must be male, female, or others",
});

export function SelectGender({ value, onChange, onBlur, name, error }: Props) {
  const handleValueChange = (selectedValue: string) => {
    try {
      // Validate the selected value
      GenderSchema.parse(selectedValue);
      onChange?.(selectedValue);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle validation error
        console.error(err.errors);
      }
    }
  };
  return (
    <Select value={value} onValueChange={handleValueChange} name={name}>
      <SelectTrigger>
        <SelectValue placeholder="choose gender" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Gender</SelectLabel>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="others">Others</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
