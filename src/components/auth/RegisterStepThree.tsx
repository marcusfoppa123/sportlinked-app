
import React from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegisterFormData } from "@/types/auth";

type RegisterStepThreeProps = {
  formData: RegisterFormData;
  updateFormData: (field: string, value: any) => void;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  togglePosition: (position: string) => void;
}

const RegisterStepThree = ({ 
  formData, 
  updateFormData, 
  handlePrevStep, 
  handleNextStep,
  togglePosition 
}: RegisterStepThreeProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <div className="space-y-2">
      <Label className="text-white">Select Sport</Label>
      <div className="flex gap-2">
        {['soccer', 'basketball', 'hockey'].map((sport) => (
          <Button
            key={sport}
            type="button"
            variant={formData.sport === sport ? "default" : "outline"}
            className="w-full justify-center"
            onClick={() => updateFormData("sport", sport)}
          >
            {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </Button>
        ))}
      </div>
    </div>
    <div className="space-y-2">
      <Label className="text-white">Select Positions (Multiple Choice)</Label>
      <div className="grid grid-cols-1 gap-2">
        {[
          'goalkeeper', 'right back', 'center back', 'left back',
          'left midfielder', 'right midfielder', 'central defending midfielder',
          'central attacking midfielder', 'striker', 'right wing', 'left wing'
        ].map((position) => (
          <Button
            key={position}
            type="button"
            variant={formData.position.includes(position) ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => togglePosition(position)}
          >
            {position.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Button>
        ))}
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="yearsPlayed" className="text-white">How many years have you played?</Label>
      <Select
        value={formData.yearsPlayed}
        onValueChange={(value) => updateFormData("yearsPlayed", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select years" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 18 }, (_, i) => i + 1).map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year} {year === 1 ? 'year' : 'years'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex gap-2">
      <Button type="button" variant="outline" className="w-1/2" onClick={handlePrevStep}>
        Back
      </Button>
      <Button type="button" className="w-1/2" onClick={handleNextStep}>
        Next Step
      </Button>
    </div>
  </motion.div>
);

export default RegisterStepThree;
