// components/AuthModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();


  const handleGuestLogin = () => {
   router.push('/login') // Use the new login function
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="flex justify-end p-4">
          <button onClick={onClose}>
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

         

          <div  className="p-6">
            <h2 className="flex text-2xl font-bold mb-8 justify-center">Please Login to Continue</h2>
            <div className="space-y-4">
            
              <button
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                onClick={handleGuestLogin}
              >
                Login
              </button>
            
            </div>
          </div>

     
 
      </DialogContent>
    </Dialog>
  );
}
