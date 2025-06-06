"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const PRESET_AMOUNTS = [10, 50, 100, 500];

export function RewardModal({ isOpen, onClose, videoId }: RewardModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    setAmount(sanitizedValue);
    setError("");
  };

  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
    setError("");
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient(`/createRewardPayment/${videoId}`, "POST", {
        amount: parseFloat(amount),
        message: message.trim(),
      });

      if (res.success && res.data?.data?.accessToken) {
        const paymentData = res.data.data.accessToken;
        const easebuzzCheckout = new (window as any).EasebuzzCheckout(paymentData, "test");

        const options = {
          access_key: paymentData,
          onResponse: (response: any) => {
            console.log("Payment response:", response);
            if (response.status === "success") {
              // Show thank you message
              onClose();
            } else {
              setError("Payment failed. Please try again.");
            }
          },
          theme: "#123456",
        };

        easebuzzCheckout.initiatePayment(options);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Send a Reward
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Preset amounts */}
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <Button
                key={preset}
                variant={amount === preset.toString() ? "default" : "outline"}
                onClick={() => handlePresetAmount(preset)}
                className="w-full"
              >
                ₹{preset}
              </Button>
            ))}
          </div>

          {/* Custom amount input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Or enter custom amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
              <Input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-7"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Optional message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Add a message (optional)</label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something nice..."
              maxLength={100}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || !amount}
          >
            {loading ? "Processing..." : `Proceed to Pay ₹${amount || '0'}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}