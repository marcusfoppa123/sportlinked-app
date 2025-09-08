
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
      name: "Free",
      priceSEK: 0,
      priceUSD: 0,
      description: "Perfect for getting started",
      features: [
        "Basic profile",
        "Limited connections",
        "Standard support",
      ],
      color: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-700 dark:text-gray-300",
      priceColor: "text-gray-600 dark:text-gray-400"
    },
    {
      id: "bronze",
      name: "Bronze",
      priceSEK: 50,
      priceUSD: 5,
      description: "Great for active users",
      features: [
        "Enhanced profile",
        "More connections",
        "Priority support",
        "Advanced messaging",
      ],
      color: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-800 dark:text-amber-300",
      priceColor: "text-amber-700 dark:text-amber-400"
    },
    {
      id: "silver",
      name: "Silver",
      priceSEK: 89,
      priceUSD: 9,
      description: "Perfect for professionals",
      features: [
        "Premium profile",
        "Unlimited connections",
        "24/7 support",
        "Advanced analytics",
        "Team features",
      ],
      color: "bg-slate-100 dark:bg-slate-800/50",
      textColor: "text-slate-600 dark:text-slate-300",
      priceColor: "text-slate-700 dark:text-slate-400"
    },
    {
      id: "gold",
      name: "Gold",
      priceSEK: 200,
      priceUSD: 20,
      description: "Ultimate experience for teams",
      features: [
        "Elite profile",
        "Unlimited everything",
        "Personal account manager",
        "Custom analytics",
        "Advanced team management",
        "API access",
      ],
      color: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-800 dark:text-yellow-300",
      priceColor: "text-yellow-700 dark:text-yellow-400"
    }
  ];
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleSubscribe = (planId: string) => {
    // In a real app, this would integrate with Stripe or another payment processor
    const planName = PLANS.find(plan => plan.id === planId)?.name || planId;
    if (planId === "free") {
      toast.success("You're now on the Free plan!");
    } else {
      toast.success(`Subscribed to the ${planName} plan!`);
    }
  };
  
  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"} dark:bg-gray-900`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">Subscriptions</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Choose Your Plan</h2>
            <p className="text-gray-600 dark:text-gray-300">Select the perfect plan for your needs</p>
          </div>
          <div className="space-y-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl shadow-md border-2 transition-all duration-200 ${plan.color} ${
                  selectedPlan === plan.id 
                    ? `border-2 ${plan.id === 'bronze' ? 'border-amber-500' : plan.id === 'silver' ? 'border-slate-500' : plan.id === 'gold' ? 'border-yellow-500' : 'border-blue-500'}` 
                    : "border-transparent"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="flex flex-col p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg font-bold ${plan.textColor}`}>{plan.name}</span>
                    {selectedPlan === plan.id && (
                      <Badge className={`text-xs px-2 py-1 rounded text-white ${
                        plan.id === 'bronze' ? 'bg-amber-500' : 
                        plan.id === 'silver' ? 'bg-slate-500' : 
                        plan.id === 'gold' ? 'bg-yellow-500' : 
                        'bg-blue-500'
                      }`}>
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="mb-2">
                    {plan.priceSEK === 0 ? (
                      <span className={`text-xl font-bold ${plan.priceColor}`}>Free</span>
                    ) : (
                      <span className={`text-2xl font-bold ${plan.priceColor}`}>{plan.priceSEK}kr</span>
                    )}
                  </div>
                  <div className={`mb-4 ${plan.textColor} text-sm`}>{plan.description}</div>
                  <ul className="mb-4 space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className={plan.textColor}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.id && (
                    <Button 
                      className={`w-full mt-2 text-white font-bold rounded-xl py-3 shadow-md border-none ${
                        plan.id === 'bronze' ? 'bg-amber-500 hover:bg-amber-600' : 
                        plan.id === 'silver' ? 'bg-slate-500 hover:bg-slate-600' : 
                        plan.id === 'gold' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                        'bg-gray-500 hover:bg-gray-600'
                      }`} 
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {plan.id === 'free' ? 'Select Free Plan' : `Subscribe to ${plan.name}`}
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
