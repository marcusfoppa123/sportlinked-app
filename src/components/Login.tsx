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
import logo from "@/assets/sportslinked-in-app.png";

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
  
  const showRoleWarning = supabaseUser && user?.role && initialRole !== user.role;
  
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 min-h-screen" style={{ backgroundColor: '#0d1a22' }}>
      <div className="flex flex-col items-center justify-center py-8 w-full max-w-md rounded-lg shadow-md" style={{ backgroundColor: '#102a37' }}>
        <img src={logo} alt="SportsLinked Logo" className="h-16 w-auto mb-4 object-contain" />
        <h2 className="text-white text-2xl font-semibold mb-2">Welcome to SportsLinked</h2>
        <p className="text-white/80 mb-6">Login or create an account to continue</p>
      </div>
      <div className="w-full max-w-md bg-transparent pt-6">
        {showRoleWarning ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <p className="text-sm">
              Your account is registered as a {user?.role}. You cannot login as a {initialRole} with the same account.
            </p>
            <p className="text-sm mt-2">
              Please log out first or use a different email address to create a new account.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm initialRole={initialRole} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm initialRole={initialRole} />
            </TabsContent>
          </Tabs>
        )}
        <div className="flex-col space-y-2 border-t pt-4 mt-6">
          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to SportsLinked's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
