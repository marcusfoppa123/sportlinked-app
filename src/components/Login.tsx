import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import logo from "@/assets/sportslinked-logo.png";
import { supabase } from "@/integrations/supabase/client";
import sportslinkedIcon from '@/assets/sportslinked-icon.png';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, ArrowLeft } from 'lucide-react';

const LoginForm = ({ initialRole, onForgotPassword }: { initialRole: UserRole, onForgotPassword: () => void }) => {
  const { login, user, supabaseUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = email.length > 3 && email.includes("@");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password, initialRole);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pr-10"
        />
        {isEmailValid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
          </span>
        )}
      </div>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pr-10"
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke="currentColor" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17.94 17.94A10.97 10.97 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.97 10.97 0 013.042-4.418M6.1 6.1A10.97 10.97 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.97 10.97 0 01-1.67 2.64M15 12a3 3 0 01-3 3m0 0a3 3 0 01-3-3m3 3l6.364 6.364M3 3l6.364 6.364"/></svg>
          )}
        </button>
      </div>
      <div className="flex justify-end">
        <button type="button" className="text-xs text-[#1877c0] hover:underline" onClick={onForgotPassword}>Forgot password?</button>
      </div>
      <Button type="submit" className="w-full bg-[#249FEE] text-white rounded-lg font-semibold hover:bg-[#1877c0] transition" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
};

interface RegisterFormProps {
  initialRole: UserRole;
}

const steps = ["Account", "Birth & Division", "Sport & Position", "Soccer Info"];

const ProgressBar = ({ step }: { step: number }) => (
  <div className="flex items-center justify-center mb-6">
    {steps.map((label, idx) => (
      <div key={label} className="flex items-center">
        <div className={`rounded-full border-2 w-8 h-8 flex items-center justify-center font-bold text-lg transition-all duration-200 ${step === idx + 1 ? 'border-blue-600 text-blue-600 bg-white' : step > idx + 1 ? 'border-blue-400 text-blue-400 bg-white' : 'border-gray-300 text-gray-400 bg-white'}`}>{idx + 1}</div>
        {idx < steps.length - 1 && <div className={`h-1 w-8 ${step > idx + 1 ? 'bg-blue-400' : 'bg-gray-200'}`}></div>}
      </div>
    ))}
  </div>
);

const RegisterForm = ({ initialRole }: RegisterFormProps) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
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
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.name, formData.role);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            birth_year: parseInt(formData.birthYear),
            birth_month: parseInt(formData.birthMonth),
            birth_day: parseInt(formData.birthDay),
            division: formData.division,
            sport: [formData.sport],
            position: formData.position,
            experience: formData.experience,
            team_size: formData.teamSize,
            team_type: formData.teamType,
            years_played: formData.yearsPlayed ? parseInt(formData.yearsPlayed) : null,
            dominant_foot: formData.dominantFoot,
            weight: formData.weight ? parseInt(formData.weight) : null,
            height: formData.height ? parseInt(formData.height) : null,
            latest_club: formData.latestClub
          })
          .eq('id', user.id);
        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }
      toast.success("Account created successfully");
      navigate("/for-you");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ProgressBar step={step} />
      {step === 1 && (
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
      )}

      {step === 2 && (
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
      )}

      {step === 3 && (
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
      )}
      {step === 4 && formData.sport === "soccer" && (
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
      )}
    </div>
  );
};

interface LoginComponentProps {
  initialRole: UserRole;
  showRegister?: boolean;
}

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSent(true);
    } catch (err) {
      toast.error('Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#1877c0] hover:text-blue-800 z-50"
          style={{ fontSize: 32 }}
          aria-label="Close"
        >
          <X size={32} />
        </button>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        {sent ? (
          <div className="text-center text-[#1877c0]">Check your email for a reset link.</div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-[#1877c0] text-white" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Login = ({ initialRole, showRegister }: LoginComponentProps) => {
  const { user, supabaseUser } = useAuth();
  const navigate = useNavigate();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(showRegister ? 'register' : 'login');
  const showRoleWarning = supabaseUser && user?.role && initialRole !== user.role;
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: '#102a37' }}>
      {/* Blue header bar at the top */}
      <div className="w-full bg-[#249FEE] py-6 px-4 flex items-center gap-3 relative" style={{ minHeight: 80 }}>
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-10"
          aria-label="Back"
        >
          <ArrowLeft size={32} className="text-white" />
        </button>
        <img src={sportslinkedIcon} alt="SportsLinked Icon" className="h-10 w-10 object-contain ml-16" />
        <div>
          <h1 className="text-white text-2xl font-bold leading-tight">Log in to SportsLinked</h1>
          <p className="text-white/80 text-base">Enter your existing account details below</p>
        </div>
      </div>
      {/* Main content, centered and responsive */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-md mx-auto">
          <div className="flex w-full mb-4">
            <button
              className={`flex-1 py-2 rounded-tl rounded-bl text-lg font-semibold ${activeTab === 'login' ? 'bg-white text-[#1877c0] border-b-2 border-[#1877c0]' : 'bg-gray-100 text-gray-400'}`}
              onClick={() => setActiveTab('login')}
            >
              Log in
            </button>
            <button
              className={`flex-1 py-2 rounded-tr rounded-br text-lg font-semibold ${activeTab === 'register' ? 'bg-white text-[#1877c0] border-b-2 border-[#1877c0]' : 'bg-gray-100 text-gray-400'}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          {activeTab === 'login' ? (
            <LoginForm initialRole={initialRole} onForgotPassword={() => setForgotOpen(true)} />
          ) : (
            <RegisterForm initialRole={initialRole} />
          )}
          <div className="flex items-center my-6 w-full">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-3 text-xs text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white text-[#1877c0] font-semibold py-2 rounded-lg shadow border border-gray-300 hover:bg-gray-100 transition mb-2"
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.86-6.86C36.13 2.13 30.45 0 24 0 14.61 0 6.44 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.61 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.56 37.13 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.67 28.29c-.5-1.48-.78-3.05-.78-4.79s.28-3.31.78-4.79l-7.98-6.2C1.13 15.87 0 19.08 0 22.5c0 3.42 1.13 6.63 2.69 9.29l7.98-6.2z"/><path fill="#EA4335" d="M24 44c6.45 0 12.13-2.13 16.05-5.81l-7.19-5.6c-2.01 1.35-4.59 2.16-7.36 2.16-6.39 0-11.87-3.63-13.33-8.71l-7.98 6.2C6.44 42.18 14.61 48 24 48z"/></g></svg>
            Sign in with Google
          </button>
          <div className="flex flex-col items-center gap-2 pt-4 pb-2" style={{ backgroundColor: '#102a37' }}>
            {activeTab === 'login' ? (
              <button
                className="w-full flex items-center justify-center gap-2 bg-white text-[#1877c0] font-semibold py-2 rounded-lg shadow border border-gray-300 hover:bg-gray-100 transition mb-2"
                onClick={() => { setActiveTab('register'); navigate('/register'); }}
              >
                Want to join SportsLinked? <span className="underline">Sign up</span>
              </button>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-2 bg-white text-[#1877c0] font-semibold py-2 rounded-lg shadow border border-gray-300 hover:bg-gray-100 transition mb-2"
                onClick={() => { setActiveTab('login'); navigate('/'); }}
              >
                Already have an account? <span className="underline">Log in</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <ForgotPasswordDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
};

export default Login;
