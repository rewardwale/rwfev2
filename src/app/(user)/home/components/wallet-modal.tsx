"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Plus, CreditCard, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/apiClient";
import Script from "next/script";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [100, 500, 1000, 2000, 5000];

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  // Load balance from localStorage
  useEffect(() => {
    if (isOpen) {
      const walletBalance = localStorage.getItem('wallet_val');
      setBalance(walletBalance ? parseFloat(walletBalance) : 0);
    }
  }, [isOpen]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowAddBalance(false);
      setAmount("");
      setError("");
      setPaymentStatus('idle');
    }
  }, [isOpen]);

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

  const handleAddBalance = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const amountValue = parseFloat(amount);
    if (amountValue < 10) {
      setError("Minimum amount is ₹10");
      return;
    }

    if (amountValue > 50000) {
      setError("Maximum amount is ₹50,000");
      return;
    }

    try {
      setLoading(true);
      setPaymentStatus('processing');
      
      // Create wallet recharge payment
      const res = await apiClient('/createWalletRechargePayment', "POST", {
        amount: amountValue,
      });

      if (res.success && res.data?.data?.accessToken) {
        const paymentData = res.data.data.accessToken;
        const easebuzzCheckout = new (window as any).EasebuzzCheckout(paymentData, "test");

        const options = {
          access_key: paymentData,
          onResponse: (response: any) => {
            console.log("Payment response:", response);
            if (response.status === "success") {
              // Update local wallet balance
              const newBalance = balance + amountValue;
              localStorage.setItem('wallet_val', newBalance.toString());
              setBalance(newBalance);
              setPaymentStatus('success');
              setAmount("");
              setShowAddBalance(false);
              
              // Show success message briefly
              setTimeout(() => {
                setPaymentStatus('idle');
              }, 3000);
            } else {
              setPaymentStatus('failed');
              setError("Payment failed. Please try again.");
            }
          },
          theme: "#123456",
        };

        easebuzzCheckout.initiatePayment(options);
      } else {
        throw new Error(res.error || "Failed to initiate payment");
      }
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      setPaymentStatus('failed');
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <Script
        src="https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/v2.0.0/easebuzz-checkout-v2.min.js"
        strategy="lazyOnload"
      />
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-muted/20 border-2">
          <DialogHeader className="space-y-4">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              My Wallet
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Balance Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Available Balance
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {formatCurrency(balance)}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-12 -translate-x-12" />
              </CardContent>
            </Card>

            {/* Success Message */}
            {paymentStatus === 'success' && (
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        Balance Added Successfully!
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Your wallet has been recharged.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Balance Section */}
            {!showAddBalance ? (
              <Button
                onClick={() => setShowAddBalance(true)}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={paymentStatus === 'processing'}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Balance
              </Button>
            ) : (
              <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Add Balance</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddBalance(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Preset amounts */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Quick amounts</p>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_AMOUNTS.map((preset) => (
                        <Button
                          key={preset}
                          variant={amount === preset.toString() ? "default" : "outline"}
                          onClick={() => handlePresetAmount(preset)}
                          className="h-10 text-sm font-medium transition-all duration-200 hover:scale-105"
                          disabled={loading}
                        >
                          ₹{preset.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount input */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Or enter custom amount</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        ₹
                      </span>
                      <Input
                        type="text"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="pl-8 h-12 text-base font-medium border-2 focus:border-primary transition-colors"
                        placeholder="Enter amount"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum: ₹10 • Maximum: ₹50,000
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive font-medium">{error}</p>
                    </div>
                  )}

                  <Button
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={handleAddBalance}
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Pay {amount && `₹${parseFloat(amount).toLocaleString()}`}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recent Transactions Placeholder */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Recent Transactions</p>
                  <Badge variant="secondary" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Transaction history will be available here
                </p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}