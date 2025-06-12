"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "../../home/components/header";
import { Sidebar } from "../../home/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Coins,
  Gift,
  CheckCircle,
  Copy,
  AlertCircle,
  Info,
} from "lucide-react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  fetchVoucherDetails,
  redeemVoucher,
  type Voucher,
  type RedeemVoucherResponse,
} from "@/apis/coupon";
import { toast } from "sonner";

export default function VoucherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const voucherId = params.voucherId as string;

  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemResult, setRedeemResult] =
    useState<RedeemVoucherResponse | null>(null);

  useEffect(() => {
    if (voucherId) {
      loadVoucherDetails();
    }
  }, [voucherId]);

  const loadVoucherDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchVoucherDetails(voucherId);
      if (response?.data && response.data.length > 0) {
        setVoucher(response.data[0]);
      } else {
        toast.error("Voucher not found");
        router.push("/coupons");
      }
    } catch (error) {
      console.error("Error loading voucher details:", error);
      toast.error("Failed to load voucher details");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!voucher) return;

    try {
      setRedeeming(true);
      const response = await redeemVoucher(voucher.voucherId);

      if (response) {
        setRedeemResult(response);
        setShowRedeemModal(true);
        toast.success("Voucher redeemed successfully!");

        // Update wallet balance in localStorage
        localStorage.setItem(
          "wallet_val",
          response.data.remainingRCoinsBalance.toString(),
        );
      } else {
        toast.error("Failed to redeem voucher");
      }
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      toast.error("Failed to redeem voucher");
    } finally {
      setRedeeming(false);
    }
  };

  const copyVoucherCode = () => {
    if (redeemResult?.data.voucherCode) {
      navigator.clipboard.writeText(redeemResult.data.voucherCode);
      toast.success("Voucher code copied to clipboard!");
    }
  };

  const openRedemptionUrl = () => {
    if (voucher?.redemptionUrl) {
      window.open(voucher.redemptionUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          {!isMobile && <Sidebar />}
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded w-1/4" />
                <Card>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-10 bg-muted rounded w-1/3" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          {!isMobile && <Sidebar />}
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Voucher not found</h2>
              <p className="text-muted-foreground mb-4">
                The voucher you're looking for doesn't exist.
              </p>
              <Button onClick={() => router.push("/coupons")}>
                Back to Coupons
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {!isMobile && <Sidebar />}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Coupons
            </Button>

            {/* Main voucher card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white p-2">
                    <Image
                      src={
                        voucher.logo || voucher.icon || "/placeholder-brand.png"
                      }
                      alt={voucher.brandName}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-brand.png";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {voucher.brandName}
                    </CardTitle>
                    <p className="text-lg text-muted-foreground mb-3">
                      {voucher.details}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="border-primary text-primary"
                      >
                        {voucher.discountType}
                      </Badge>
                      <Badge variant="secondary">{voucher.type}</Badge>
                      <Badge variant="secondary">{voucher.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Key information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Validity</p>
                        <p className="text-sm text-muted-foreground">
                          {voucher.validity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Coins className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Cost</p>
                        <p className="text-sm text-primary font-semibold">
                          {voucher.inputCost} coins
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Consumption Type</p>
                        <p className="text-sm text-muted-foreground">
                          {voucher.consumptionType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Redemption Process</h3>
                      <p className="text-sm text-muted-foreground">
                        {voucher.redemptionProcess}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Terms and Conditions */}
                <div>
                  <h3 className="font-semibold mb-3">Terms & Conditions</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-line">{voucher.tnc}</p>
                  </div>
                </div>

                <Separator />

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleRedeem}
                    disabled={redeeming}
                    className="flex-1"
                    size="lg"
                    style={{
                      lineHeight: "40px",
                    }}
                  >
                    {redeeming ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Redeeming...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Redeem for {voucher.inputCost} coins
                      </>
                    )}
                  </Button>

                  {voucher.redemptionUrl && (
                    <Button
                      variant="outline"
                      onClick={openRedemptionUrl}
                      className="flex-1"
                      size="lg"
                      style={{
                        lineHeight: "40px",
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Store
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Redeem Success Modal */}
      <Dialog open={showRedeemModal} onOpenChange={setShowRedeemModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Voucher Redeemed Successfully!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center">
              <div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto
                  mb-4"
              >
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Your voucher code is ready!
              </h3>
              <p className="text-sm text-muted-foreground">
                Use this code at checkout to get your discount
              </p>
            </div>

            {redeemResult && (
              <>
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Voucher Code
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-lg font-mono font-bold bg-white px-3 py-2 rounded border">
                      {redeemResult.data.voucherCode}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyVoucherCode}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Remaining Balance:{" "}
                    <span className="font-semibold text-primary">
                      {redeemResult.data.remainingRCoinsBalance} coins
                    </span>
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRedeemModal(false)}
                className="flex-1"
              >
                Close
              </Button>
              {voucher.redemptionUrl && (
                <Button
                  onClick={() => {
                    openRedemptionUrl();
                    setShowRedeemModal(false);
                  }}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Use Now
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
