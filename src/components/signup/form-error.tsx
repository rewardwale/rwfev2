import { BsExclamationCircle } from "react-icons/bs";

interface FormErrorProps {
  message?: string;
}

export default function FormError({ message }: FormErrorProps) {
  return (
    <div className="bg-destructive/15 p-3 rounded flex gap-x-2 text-sm items-center text-destructive">
      <BsExclamationCircle className="h-4 w-4" />
      <p className="text-xs sm:text-sm">{message}</p>
    </div>
  );
}
