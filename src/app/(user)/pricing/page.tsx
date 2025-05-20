"use client";

import { useEffect, useState } from "react";
import { Header } from "../home/components/header";
import { Sidebar } from "../home/components/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useIsMobile } from "@/hooks/use-mobile";
import Script from "next/script";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingPlan {
  _id: string;
  name: string;
  description: string;
  currency: string;
  price: number;
  bilingCycle: string;
  validityMonth: number | null;
  features: string[];
  trialPeriodDays: number;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    if (responseData) {
      updatePaymentRecord();
    }
  }, [responseData]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiClient("/subscriptionPlans", "GET");
        if (response.success && response.data?.data) {
          setPlans(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const updatePaymentRecord = async () => {
    try {
      const res = await apiClient('/payment-update', 'POST', responseData);
      console.log("Payment record updated:", res);
    } catch (error) {
      console.error("Error updating payment record:", error);
    }
  };

  const handleCreatePayment = async (planId: string) => {
    try {
      const res = await apiClient(`/createSubscriptionPayment/${planId}`, "POST");
      const paymentData = res.data.data.accessToken;
      
      const easebuzzCheckout = new (window as any).EasebuzzCheckout(paymentData, "test");

      const options = {
        access_key: paymentData,
        onResponse: (response: any) => {
          setResponseData(response);
          console.log("Payment response:", response);
        },
        theme: "#123456",
      };

      easebuzzCheckout.initiatePayment(options);
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const calculatePrice = (basePrice: number) => {
    if (isYearly) {
      return (basePrice * 12 * 0.8).toFixed(0);
    }
    return basePrice;
  };

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          {!isMobile && <Sidebar />}
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-8 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-6 bg-muted rounded w-full mb-2" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-4 bg-muted rounded w-3/4" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Script
        src="https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/v2.0.0/easebuzz-checkout-v2.min.js"
        strategy="lazyOnload"
        onLoad={() => console.log("Easebuzz script loaded")}
      />
      <Header />
      <div className="flex">
        {!isMobile && <Sidebar />}
        <main className="flex-1 p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Choose Your Plan
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className={cn(
                "transition-colors duration-200",
                !isYearly ? "font-semibold text-primary" : "text-muted-foreground"
              )}>
                6 Months
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-primary"
              />
              <span className={cn(
                "transition-colors duration-200",
                isYearly ? "font-semibold text-primary" : "text-muted-foreground"
              )}>
                Yearly
              </span>
              {isYearly && (
                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary dark:bg-primary/20">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan._id}
                className={cn(
                  "p-6 flex flex-col cursor-pointer transition-all duration-300",
                  "hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10",
                  "dark:bg-background/95 backdrop-blur-sm",
                  plan.name === "Half Yearly" && "relative border-2 border-primary dark:border-primary/80"
                )}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.name === "Half Yearly" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium dark:bg-primary/90">
                      Recommended
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-foreground">{plan.currency}</span>
                    <span className="text-5xl font-bold text-foreground">{calculatePrice(plan.price)}</span>
                    {plan.bilingCycle !== "none" && (
                      <span className="text-muted-foreground ml-2">
                        /{isYearly ? "year" : "6 months"}
                      </span>
                    )}
                  </div>
                  {plan.trialPeriodDays > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.trialPeriodDays} days free trial
                    </p>
                  )}
                </div>
                <div className="space-y-4 flex-grow">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center group">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 transition-transform group-hover:scale-110" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className={cn(
                    "mt-6 transition-all duration-300",
                    plan.name === "Half Yearly" 
                      ? "bg-primary hover:bg-primary/90 dark:hover:bg-primary/80" 
                      : "hover:bg-primary/10 dark:hover:bg-primary/20"
                  )}
                  variant={plan.name === "Half Yearly" ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreatePayment(plan._id);
                  }}
                >
                  {plan.price === 0 ? "Get Started" : "Subscribe Now"}
                </Button>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="dark:bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">{selectedPlan?.name} Plan Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{selectedPlan?.currency}</span>
                <span className="text-5xl font-bold text-foreground">
                  {selectedPlan && calculatePrice(selectedPlan.price)}
                </span>
                <span className="text-muted-foreground ml-2">
                  /{isYearly ? "year" : "6 months"}
                </span>
              </div>
              {selectedPlan?.trialPeriodDays ? (
                <p className="text-sm text-muted-foreground mt-2">
                  Includes {selectedPlan.trialPeriodDays} days free trial
                </p>
              ) : null}
            </div>
            <div className="space-y-4">
              {selectedPlan?.features.map((feature, index) => (
                <div key={index} className="flex items-center group">
                  <Check className="h-5 w-5 text-primary mr-2 transition-transform group-hover:scale-110" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-6 bg-primary hover:bg-primary/90 dark:hover:bg-primary/80"
              onClick={() => {
                if (selectedPlan) {
                  handleCreatePayment(selectedPlan._id);
                }
                setShowPlanModal(false);
              }}
            >
              Subscribe Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}