import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ProgressBar from "./ProgressBar";
import RegisterStepOne from "./RegisterStepOne";
import RegisterStepTwo from "./RegisterStepTwo";
import RegisterStepThree from "./RegisterStepThree";
import RegisterStepFour from "./RegisterStepFour";
import EmailExistsModal from "./EmailExistsModal";
import { RegisterFormData } from "@/types/auth";

interface RegisterFormProps {
  initialRole: UserRole;
}

const STEPS = ["Account", "Birth & Division", "Sport & Position", "Soccer Info"];

const RegisterForm = ({ initialRole }: RegisterFormProps) => {
  const { register, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRole,
    sport: "",
    position: [] as string[],
    experience: "",
    teamSize: "",
    teamType: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    division: "",
    yearsPlayed: "",
    dominantFoot: "",
    weight: "",
    height: "",
    latestClub: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [maxStep, setMaxStep] = useState(1);
  const [emailExistsModal, setEmailExistsModal] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const togglePosition = (position: string) => {
    const currentPositions = formData.position;
    if (currentPositions.includes(position)) {
      updateFormData("position", currentPositions.filter(p => p !== position));
    } else {
      updateFormData("position", [...currentPositions, position]);
    }
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
          options: {
            shouldCreateUser: false
          }
        });
        
        // If no error, email exists (since OTP was sent)
        if (!error) {
          setEmailExistsModal(true);
          return;
        }
      } catch (error) {
        // Continue to next step if there's an error (email doesn't exist)
      }
    } else if (step === 2) {
      if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
        toast.error("Please select your birth date");
        return;
      }
      if (!formData.division) {
        toast.error("Please select your division");
        return;
      }
    } else if (step === 3) {
      if (!formData.sport || formData.position.length === 0) {
        toast.error("Please complete all required information");
        return;
      }
    } else if (step === 4 && formData.sport === "soccer") {
      if (!formData.dominantFoot || !formData.weight || !formData.height || !formData.latestClub) {
        toast.error("Please complete all soccer info");
        return;
      }
    }
    setStep(step + 1);
    setMaxStep(Math.max(maxStep, step + 1));
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Attempt to register the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: formData.role,
            birthYear: formData.birthYear,
            birthMonth: formData.birthMonth,
            birthDay: formData.birthDay,
            division: formData.division,
            sport: formData.sport,
            position: formData.position.join(','),
            experience: formData.experience,
            teamSize: formData.teamSize,
            teamType: formData.teamType,
            yearsPlayed: formData.yearsPlayed,
            dominantFoot: formData.dominantFoot,
            weight: formData.weight,
            height: formData.height,
            latestClub: formData.latestClub
          }
        }
      });
      
      if (error) {
        // Check for existing email error
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

      // Profile is created by trigger, so we don't need to insert from the client.
      await refreshUserProfile(data.user.id);
      toast.success("Account created successfully! Please check your email for verification.");
      navigate("/for-you");

    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific error for email already in use
      if (error.message?.includes('User already registered') || 
          error.message?.includes('email already in use') ||
          error.message?.includes('duplicate key value violates unique constraint') ||
          error.message?.toLowerCase().includes('email address already exists')) {
        setEmailExistsModal(true);
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableDivisions = () => {
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(formData.birthYear);
    const age = currentYear - birthYear;

    const baseDivisions = [
      "P13", "P14", "P15", "P16", "P17", "P18", "P19",
      "F13", "F14", "F15", "F16", "F17", "F18", "F19"
    ];

    if (age >= 17 && age <= 19) {
      return [...baseDivisions, "P19 Allsvenskan", "P17 Allsvenskan", "F19 Allsvenskan", "F17 Allsvenskan"];
    }

    return baseDivisions;
  };

  return (
    <div className="space-y-4">
      <ProgressBar step={step} onStepClick={handleStepClick} maxStep={maxStep} steps={STEPS} />
      
      {step === 1 && (
        <RegisterStepOne 
          formData={formData} 
          updateFormData={updateFormData} 
          handleNextStep={handleNextStep}
        />
      )}

      {step === 2 && (
        <RegisterStepTwo 
          formData={formData} 
          updateFormData={updateFormData}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
          getAvailableDivisions={getAvailableDivisions}
        />
      )}

      {step === 3 && (
        <RegisterStepThree
          formData={formData}
          updateFormData={updateFormData}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
          togglePosition={togglePosition}
        />
      )}
      
      {step === 4 && formData.sport === "soccer" && (
        <RegisterStepFour
          formData={formData}
          updateFormData={updateFormData}
          handlePrevStep={handlePrevStep}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
      
      <EmailExistsModal 
        open={emailExistsModal} 
        onClose={() => setEmailExistsModal(false)} 
      />
    </div>
  );
};

export default RegisterForm;
