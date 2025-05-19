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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      
    //   await api.post("payment-update", {
    //     ...responseData,
    //   });
      console.log("Payment record updated:", res);
    } catch (error) {
      console.error("Error updating payment record:", error);
    }
  };
  const handleCreatePayment = async (planId: string) => {
    try {
      //   const res = await api.post(`createSubscriptionPayment`, {
      //     planId,
      //   });

      const res = await apiClient(
        `/createSubscriptionPayment/${planId}`,
        "POST",
      );

      const paymentData = res.data.data.accessToken;
      // const { access_key } = paymentData;

      console.log("checking key", paymentData);
      const easebuzzCheckout = new (window as any).EasebuzzCheckout(
        paymentData,
        "test",
      ); // Use "prod" in production

      const options = {
        access_key: paymentData, // access key received via Initiate Payment
        onResponse: (response: any) => {
          setResponseData(response);
          setIsModalOpen(true);
          console.log("Payment response:", responseData);
          // Handle success or failure responses
        },
        theme: "#123456", // Customize the iframe theme color
      };

      // Initiate the payment via the iframe
      easebuzzCheckout.initiatePayment(options);
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
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
          <h1 className="text-3xl font-bold text-center mb-8">
            Choose Your Plan
          </h1>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
            style={{
              display: `${isMobile ? "" : "flex"}`,
              justifyContent: "center",
              // alignItems:'center'
            }}
          >
            {plans.map((plan) => (
              <Card
                key={plan._id}
                className={`p-6 flex flex-col ${
                plan.name === "Growth"
                    ? "border-2 border-primary relative"
                    : ""
                }`}
              >
                {plan.name === "Growth" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Recommended
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <p className="text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{plan.currency}</span>
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.bilingCycle !== "none" && (
                      <span className="text-muted-foreground ml-2">
                        /{plan.bilingCycle === "yearly" ? "year" : "6 months"}
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
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className={`mt-6 ${plan.name === "Growth" ? "bg-primary" : ""}`}
                  variant={plan.name === "Growth" ? "default" : "outline"}
                  onClick={() => handleCreatePayment(plan._id)}
                >
                  {plan.price === 0 ? "Get Started" : "Subscribe Now"}
                </Button>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
