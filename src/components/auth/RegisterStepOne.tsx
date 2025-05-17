
import React from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegisterFormData } from "@/types/auth";

type RegisterStepOneProps = {
  formData: RegisterFormData;
  updateFormData: (field: string, value: any) => void;
  handleNextStep: () => void;
}

const RegisterStepOne = ({ formData, updateFormData, handleNextStep }: RegisterStepOneProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <div className="space-y-2">
      <Label htmlFor="name" className="text-white">Full Name</Label>
      <Input
        id="name"
        placeholder="John Doe"
        value={formData.name}
        onChange={(e) => updateFormData("name", e.target.value)}
        required
      />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="email" className="text-white">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) => updateFormData("email", e.target.value)}
        required
      />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="password" className="text-white">Password</Label>
      <Input
        id="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => updateFormData("password", e.target.value)}
        required
      />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
      <Input
        id="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
        required
      />
    </div>
    
    <Button 
      onClick={handleNextStep}
      className="w-full bg-[#249FEE] hover:bg-[#249FEE]/90 text-white"
    >
      Next Step
    </Button>
  </motion.div>
);

export default RegisterStepOne;
