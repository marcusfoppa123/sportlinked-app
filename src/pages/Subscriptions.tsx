
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Subscriptions = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAthlete = user?.role === "athlete";
  
  const [selectedPlan, setSelectedPlan] = useState("free");
  
  // Define PLANS after we have access to the translation function
  const PLANS = [
    {
      id: "free",
      name: t("subscriptions.standard"),
      priceSEK: 0,
      priceUSD: 0,
      description: t("subscriptions.standardDesc"),
      features: [
        t("subscriptions.feature1"),
        t("subscriptions.feature2"),
        t("subscriptions.feature3"),
      ],
      color: "bg-gray-200 dark:bg-gray-700"
    },
    {
      id: "pro",
      name: t("subscriptions.pro"),
      priceSEK: 89,
      priceUSD: 8.5,
      description: t("subscriptions.proDesc"),
      features: [
        t("subscriptions.feature1"),
        t("subscriptions.feature2"),
        t("subscriptions.feature3"),
        t("subscriptions.feature4"),
        t("subscriptions.feature5"),
      ],
      color: "bg-blue-100 dark:bg-blue-900"
    },
    {
      id: "premium",
      name: t("subscriptions.premium"),
      priceSEK: 249,
      priceUSD: 24,
      description: t("subscriptions.premiumDesc"),
      features: [
        t("subscriptions.feature1"),
        t("subscriptions.feature2"),
        t("subscriptions.feature3"),
        t("subscriptions.feature4"),
        t("subscriptions.feature5"),
        t("subscriptions.feature6"),
      ],
      color: "bg-yellow-100 dark:bg-yellow-900"
    }
  ];
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleSubscribe = (planId: string) => {
    // In a real app, this would integrate with Stripe or another payment processor
    if (planId === "free") {
      toast.success("You're now on the Free plan!");
    } else {
      toast.success(`Subscribed to the ${planId === "pro" ? "Pro" : "Premium"} plan!`);
    }
  };
  
  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"} dark:bg-gray-900`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">{t("subscriptions.title")}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 dark:text-white">{t("subscriptions.choosePlan")}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t("subscriptions.choosePlanDesc")}</p>
          </div>
          <div className="space-y-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl shadow-md border-2 transition-all duration-200 ${selectedPlan === plan.id ? "border-blue-500 bg-white dark:bg-gray-800" : "border-transparent bg-gray-50 dark:bg-gray-900"}`}
                onClick={() => setSelectedPlan(plan.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="flex flex-col p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold dark:text-white">{plan.name}</span>
                    {selectedPlan === plan.id && (
                      <span className="text-xs px-2 py-1 rounded bg-blue-500 text-white">{t("subscriptions.active")}</span>
                    )}
                  </div>
                  <div className="mb-2">
                    {plan.priceSEK === 0 ? (
                      <span className="text-xl font-bold text-gray-700 dark:text-white">{t("subscriptions.complimentary")}</span>
                    ) : (
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{plan.priceSEK} SEK</span>
                    )}
                  </div>
                  <div className="mb-4 text-gray-600 dark:text-gray-300 text-sm">{plan.description}</div>
                  <ul className="mb-4 space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.id && (
                    <Button className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl py-3 shadow-md border-none" onClick={() => handleSubscribe(plan.id)}>
                      {t("subscriptions.continue")}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Subscriptions;
