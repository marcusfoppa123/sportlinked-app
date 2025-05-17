
import React from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegisterFormData } from "@/types/auth";

type RegisterStepFourProps = {
  formData: RegisterFormData;
  updateFormData: (field: string, value: any) => void;
  handlePrevStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

const RegisterStepFour = ({ 
  formData, 
  updateFormData, 
  handlePrevStep, 
  handleSubmit,
  isLoading 
}: RegisterStepFourProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <div className="space-y-2">
      <Label className="text-white">Dominant Foot</Label>
      <div className="flex gap-2">
        {['left', 'right'].map((foot) => (
          <Button
            key={foot}
            type="button"
            variant={formData.dominantFoot === foot ? "default" : "outline"}
            className="w-full justify-center"
            onClick={() => updateFormData("dominantFoot", foot)}
          >
            {foot.charAt(0).toUpperCase() + foot.slice(1)}
          </Button>
        ))}
      </div>
    </div>
    <div className="space-y-2">
      <Label className="text-white">Weight (kg)</Label>
      <Select
        value={formData.weight}
        onValueChange={(value) => updateFormData("weight", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select weight" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 91 }, (_, i) => i + 40).map((kg) => (
            <SelectItem key={kg} value={kg.toString()}>
              {kg} kg
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label className="text-white">Height (cm)</Label>
      <Select
        value={formData.height}
        onValueChange={(value) => updateFormData("height", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select height" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 81 }, (_, i) => i + 140).map((cm) => (
            <SelectItem key={cm} value={cm.toString()}>
              {cm} cm
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label className="text-white">Latest/Current Club</Label>
      <Input
        id="latestClub"
        placeholder="Your latest or current club"
        value={formData.latestClub}
        onChange={(e) => updateFormData("latestClub", e.target.value)}
      />
    </div>
    <div className="flex gap-2">
      <Button type="button" variant="outline" className="w-1/2" onClick={handlePrevStep}>
        Back
      </Button>
      <Button type="button" className="w-1/2" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Creating account..." : "Register & Go Home"}
      </Button>
    </div>
  </motion.div>
);

export default RegisterStepFour;
