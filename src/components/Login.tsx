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
import logo from "@/assets/SportsLinked in app.png";
import { ArrowLeft, Apple, Google, KeyRound } from "lucide-react";

const LoginForm = ({ initialRole }: { initialRole: UserRole }) => {
  const { login, user, supabaseUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
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

const Login = ({ initialRole }: LoginComponentProps) => {
  const { user, supabaseUser } = useAuth();
  const [tab, setTab] = useState("login");

  // Show role warning if needed
  const showRoleWarning = supabaseUser && user?.role && initialRole !== user.role;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#102a37] relative">
      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full shadow transition"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
        <img src={logo} alt="SportsLinked Logo" className="h-16 w-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in to SportsLinked</h2>
        <p className="text-gray-500 mb-6">Welcome back! Please sign in to your account.</p>

        {showRoleWarning && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-md mb-4 w-full text-sm">
            Your account is registered as a {user?.role}. You cannot login as a {initialRole} with the same account.
            <br />Please log out first or use a different email address to create a new account.
          </div>
        )}

        <Tabs defaultValue={tab} className="w-full" onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 rounded-lg">
            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-[#102a37] data-[state=active]:text-white">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-[#102a37] data-[state=active]:text-white">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm initialRole={initialRole} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm initialRole={initialRole} />
          </TabsContent>
        </Tabs>

        {/* Social login options */}
        <div className="w-full mt-6 flex flex-col gap-3">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50">
            <Apple className="h-5 w-5" /> Continue with Apple
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50">
            <Google className="h-5 w-5 text-[#4285F4]" /> Continue with Google
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50">
            <KeyRound className="h-5 w-5 text-[#10b981]" /> Continue with Passkey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
