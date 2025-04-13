
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

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    description: "Basic features for athletes and scouts",
    features: [
      "Create profile",
      "View limited athlete profiles",
      "Post updates (limited)",
      "Basic messaging"
    ],
    notIncluded: [
      "Advanced search filters",
      "Unlimited messages",
      "Analytics",
      "Priority support"
    ],
    color: "bg-gray-200 dark:bg-gray-700"
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    yearlyPrice: 99.99,
    description: "Enhanced features for serious users",
    features: [
      "All Free features",
      "Advanced search filters",
      "Unlimited posts and messages",
      "Analytics dashboard",
      "Export data"
    ],
    notIncluded: [
      "Priority placement in search",
      "24/7 support"
    ],
    color: "bg-blue-100 dark:bg-blue-900"
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    yearlyPrice: 199.99,
    description: "Maximum exposure and opportunities",
    features: [
      "All Pro features",
      "Priority placement in search",
      "Video analysis tools",
      "Direct connection with scouts/teams",
      "24/7 priority support",
      "Exclusive events access"
    ],
    notIncluded: [],
    color: "bg-purple-100 dark:bg-purple-900"
  }
];

const Subscriptions = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAthlete = user?.role === "athlete";
  
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
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
  
  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly");
  };
  
  const getDiscountPercent = () => {
    return 17; // 17% discount for yearly billing
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Choose Your Plan</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Select the plan that best fits your needs and unlock premium features
            </p>
            
            {/* Billing cycle toggle */}
            <div className="mt-6 p-1 inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <button 
                className={`px-4 py-2 rounded-full text-sm ${
                  billingCycle === "monthly" 
                    ? `${isAthlete ? "bg-athlete text-white" : "bg-scout text-white"}` 
                    : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              
              <button 
                className={`px-4 py-2 rounded-full text-sm ${
                  billingCycle === "yearly" 
                    ? `${isAthlete ? "bg-athlete text-white" : "bg-scout text-white"}` 
                    : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly <span className="text-xs font-bold">Save {getDiscountPercent()}%</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <motion.div 
                key={plan.id}
                whileHover={{ scale: 1.03 }}
                className="flex"
              >
                <Card 
                  className={`flex flex-col w-full border-2 dark:bg-gray-800 ${
                    selectedPlan === plan.id 
                      ? `border-athlete dark:border-athlete` 
                      : "border-transparent"
                  }`}
                >
                  <CardHeader className={`${plan.color} bg-opacity-30 text-center rounded-t-lg`}>
                    <CardTitle className="dark:text-white">
                      {plan.name}
                      {plan.id === "pro" && (
                        <Badge className="ml-2 bg-athlete text-white">Popular</Badge>
                      )}
                    </CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold dark:text-white">
                        ${billingCycle === "monthly" ? plan.price : plan.yearlyPrice}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <div className="space-y-3 mt-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500">
                            <Check className="h-5 w-5" />
                          </div>
                          <p className="ml-2 text-sm dark:text-gray-300">{feature}</p>
                        </div>
                      ))}
                      
                      {plan.notIncluded.map((feature, index) => (
                        <div key={index} className="flex items-start opacity-50">
                          <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                            <Check className="h-5 w-5" />
                          </div>
                          <p className="ml-2 text-sm line-through dark:text-gray-400">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className={`w-full ${
                        plan.id === "free" 
                          ? "bg-gray-500 hover:bg-gray-600" 
                          : `${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}`
                      }`}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {plan.id === "free" ? "Current Plan" : `Subscribe to ${plan.name}`}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>All plans include a 7-day money-back guarantee. No contracts, cancel anytime.</p>
          </div>
        </div>
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Subscriptions;
