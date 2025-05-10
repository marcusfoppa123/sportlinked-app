import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import logo from "@/assets/sportslinked-logo.png";
import { supabase } from "@/integrations/supabase/client";
import sportslinkedIcon from '@/assets/sportslinked-icon.png';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
      <Button type="submit" className="w-full bg-[#102a37] text-white" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
};

interface RegisterFormProps {
  initialRole: UserRole;
}

const RegisterForm = ({ initialRole }: RegisterFormProps) => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRole,
    sport: "",
    position: "",
    experience: "",
    teamSize: "",
    teamType: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.role === "team") {
      if (!formData.role || !formData.sport || !formData.teamType) {
        toast.error("Please complete all required information");
        return;
      }
    } else if (!formData.role || !formData.sport || !formData.position) {
      toast.error("Please complete all required information");
      return;
    }
    
    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.name, formData.role);
      toast.success("Account created successfully");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Password</Label>
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
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData("confirmPassword", e.target.value)}
              required
            />
          </div>
          
          <Button type="button" className="w-full" onClick={handleNextStep}>
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
          <div className="space-y-2">
            <Label>I am a</Label>
            <RadioGroup
              defaultValue={formData.role || "athlete"}
              onValueChange={(value) => updateFormData("role", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="athlete" id="athlete" />
                <Label htmlFor="athlete" className="cursor-pointer">Athlete</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scout" id="scout" />
                <Label htmlFor="scout" className="cursor-pointer">Scout</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="team" id="team" />
                <Label htmlFor="team" className="cursor-pointer">Team/Club</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sport">Sport</Label>
            <Input
              id="sport"
              placeholder="Basketball, Football, etc."
              value={formData.sport}
              onChange={(e) => updateFormData("sport", e.target.value)}
              required
            />
          </div>
          
          {formData.role === "team" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="teamType">Team Type</Label>
                <Input
                  id="teamType"
                  placeholder="Professional, College, High School, etc."
                  value={formData.teamType}
                  onChange={(e) => updateFormData("teamType", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  placeholder="Number of athletes/members"
                  value={formData.teamSize}
                  onChange={(e) => updateFormData("teamSize", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="position">
                  {formData.role === "athlete" ? "Position" : "Organization/Team"}
                </Label>
                <Input
                  id="position"
                  placeholder={formData.role === "athlete" ? "Point Guard, Forward, etc." : "Lakers, Michigan State, etc."}
                  value={formData.position}
                  onChange={(e) => updateFormData("position", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Input
                  id="experience"
                  placeholder="College, Professional, High School"
                  value={formData.experience}
                  onChange={(e) => updateFormData("experience", e.target.value)}
                />
              </div>
            </>
          )}
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="w-1/2" onClick={handlePrevStep}>
              Back
            </Button>
            <Button type="button" className="w-1/2" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface LoginComponentProps {
  initialRole: UserRole;
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

const Login = ({ initialRole }: LoginComponentProps) => {
  const { user, supabaseUser } = useAuth();
  const navigate = useNavigate();
  const [forgotOpen, setForgotOpen] = useState(false);
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
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <Card className="w-full h-full flex flex-col justify-center items-center rounded-none shadow-none border-none bg-white">
        <CardHeader className="pb-2" style={{ backgroundColor: '#1877c0' }}>
          <div className="flex items-center gap-3">
            <img src={sportslinkedIcon} alt="SportsLinked Icon" className="h-10 w-10 object-contain rounded-full bg-white p-1" />
            <CardTitle className="text-white text-2xl font-bold">Log in to SportsLinked</CardTitle>
          </div>
          <CardDescription className="text-white/80 mt-1">Enter your existing account details below</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-2 px-6">
          <LoginForm initialRole={initialRole} onForgotPassword={() => setForgotOpen(true)} />
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
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 border-t pt-4 pb-2 bg-gray-50">
          <span className="text-sm text-gray-500">Want to join SportsLinked? <button onClick={() => navigate('/register')} className="text-[#1877c0] font-semibold hover:underline">Sign up</button></span>
        </CardFooter>
      </Card>
      <ForgotPasswordDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
};

export default Login;
