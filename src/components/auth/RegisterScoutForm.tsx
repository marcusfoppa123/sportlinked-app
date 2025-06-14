
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ProgressBar from "./ProgressBar";
import EmailExistsModal from "./EmailExistsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const STEPS = ["Account", "Scout Type", "Experience", "Sport"];

const RegisterScoutForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    scoutType: "",
    scoutTeam: "",
    scoutYearsExperience: "",
    scoutSport: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [maxStep, setMaxStep] = useState(1);
  const [emailExistsModal, setEmailExistsModal] = useState(false);

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      // Check if email exists before proceeding
      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: { shouldCreateUser: false }
        });
        if (!error) {
          setEmailExistsModal(true);
          return;
        }
      } catch (error) {}
    } else if (step === 2) {
      if (!formData.scoutType) {
        toast.error("Please select your scout type");
        return;
      }
      if (formData.scoutType === "team" && !formData.scoutTeam) {
        toast.error("Please enter your team name");
        return;
      }
    } else if (step === 3) {
      if (!formData.scoutYearsExperience) {
        toast.error("Please select your years of experience");
        return;
      }
    } else if (step === 4) {
      if (!formData.scoutSport) {
        toast.error("Please select your sport");
        return;
      }
    }
    setStep(step + 1);
    setMaxStep(Math.max(maxStep, step + 1));
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleStepClick = (targetStep) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: "scout"
          }
        }
      });
      if (error) {
        if (error.message?.includes('User already registered') || 
            error.message?.includes('email already in use') ||
            error.message?.includes('duplicate key value') ||
            error.message?.toLowerCase().includes('already exists')) {
          setEmailExistsModal(true);
          setIsLoading(false);
          return;
        }
        toast.error(error.message || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }
      if (!data.user) {
        toast.error('Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Prepare profile data with proper types
      const profileData = {
        id: data.user.id,
        full_name: formData.name,
        role: "scout",
        email: formData.email,
        scout_type: formData.scoutType, // Make sure this is 'independent' or 'team'
        scout_team: formData.scoutType === "team" ? formData.scoutTeam : null,
        scout_years_experience: parseInt(formData.scoutYearsExperience), // Convert to integer
        scout_sport: formData.scoutSport,
        followers: 0,
        following: 0
      };

      console.log("Attempting to insert profile data:", profileData);

      // Save scout info to profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (profileError) {
        console.error("Detailed profile error:", profileError);
        console.error("Error message:", profileError.message);
        console.error("Error details:", profileError.details);
        console.error("Error hint:", profileError.hint);
        console.error("Error code:", profileError.code);
        
        toast.error(`Profile setup failed: ${profileError.message || profileError.details || JSON.stringify(profileError)}`);
      } else {
        console.log("Profile created successfully");
        toast.success("Account created successfully! Please check your email for verification.");
        navigate("/for-you");
      }
    } catch (error) {
      console.error("Caught error during registration:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ProgressBar step={step} onStepClick={handleStepClick} maxStep={maxStep} steps={STEPS} />
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={formData.name} onChange={e => updateFormData("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={e => updateFormData("email", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={e => updateFormData("password", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={e => updateFormData("confirmPassword", e.target.value)} required />
          </div>
          <Button onClick={handleNextStep} className="w-full bg-[#249FEE] hover:bg-[#249FEE]/90 text-white">Next Step</Button>
        </motion.div>
      )}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
          <Label className="text-white">Are you an independent/private scout or do you scout for a team?</Label>
          <div className="flex gap-2">
            {['independent', 'team'].map(type => (
              <Button key={type} type="button" variant={formData.scoutType === type ? "default" : "outline"} className="w-full justify-center" onClick={() => updateFormData("scoutType", type)}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
          {formData.scoutType === "team" && (
            <div className="space-y-2">
              <Label htmlFor="scoutTeam" className="text-white">Which team do you scout for?</Label>
              <Input id="scoutTeam" placeholder="Enter team name" value={formData.scoutTeam} onChange={e => updateFormData("scoutTeam", e.target.value)} />
            </div>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="w-1/2" onClick={handlePrevStep}>Back</Button>
            <Button type="button" className="w-1/2" onClick={handleNextStep}>Next Step</Button>
          </div>
        </motion.div>
      )}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
          <Label className="text-white">How many years have you been a scout?</Label>
          <Select value={formData.scoutYearsExperience} onValueChange={value => updateFormData("scoutYearsExperience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 51 }, (_, i) => i).map(year => (
                <SelectItem key={year} value={year.toString()}>{year} {year === 1 ? 'year' : 'years'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="w-1/2" onClick={handlePrevStep}>Back</Button>
            <Button type="button" className="w-1/2" onClick={handleNextStep}>Next Step</Button>
          </div>
        </motion.div>
      )}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
          <Label className="text-white">What sport do you scout for?</Label>
          <div className="flex gap-2">
            {['soccer', 'basketball', 'hockey', 'baseball', 'football'].map(sport => (
              <Button key={sport} type="button" variant={formData.scoutSport === sport ? "default" : "outline"} className="w-full justify-center" onClick={() => updateFormData("scoutSport", sport)}>
                {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="w-1/2" onClick={handlePrevStep}>Back</Button>
            <Button type="button" className="w-1/2" onClick={handleSubmit} disabled={isLoading || !formData.scoutSport}>{isLoading ? "Creating account..." : "Register & Go Home"}</Button>
          </div>
        </motion.div>
      )}
      <EmailExistsModal open={emailExistsModal} onClose={() => setEmailExistsModal(false)} />
    </div>
  );
};

export default RegisterScoutForm;
