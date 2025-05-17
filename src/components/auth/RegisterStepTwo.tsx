
import React from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegisterFormData } from "@/types/auth";

type RegisterStepTwoProps = {
  formData: RegisterFormData;
  updateFormData: (field: string, value: any) => void;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  getAvailableDivisions: () => string[];
}

const RegisterStepTwo = ({ 
  formData, 
  updateFormData, 
  handlePrevStep, 
  handleNextStep,
  getAvailableDivisions
}: RegisterStepTwoProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <div className="space-y-4">
      <Label className="text-white">Date of Birth</Label>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthYear" className="text-white">Year</Label>
          <Select
            value={formData.birthYear}
            onValueChange={(value) => updateFormData("birthYear", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 13 - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthMonth" className="text-white">Month</Label>
          <Select
            value={formData.birthMonth}
            onValueChange={(value) => updateFormData("birthMonth", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                  {month.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthDay" className="text-white">Day</Label>
          <Select
            value={formData.birthDay}
            onValueChange={(value) => updateFormData("birthDay", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString().padStart(2, '0')}>
                  {day.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="division" className="text-white">Division/League</Label>
      <Select
        value={formData.division}
        onValueChange={(value) => updateFormData("division", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your division" />
        </SelectTrigger>
        <SelectContent>
          {getAvailableDivisions().map((division) => (
            <SelectItem key={division} value={division}>
              {division}
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

export default RegisterStepTwo;
