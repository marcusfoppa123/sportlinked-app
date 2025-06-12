import React, { useState } from "react";
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
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, ArrowLeft } from 'lucide-react';
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

interface LoginComponentProps {
  initialRole: UserRole;
  showRegister?: boolean;
}

const Login = ({ initialRole, showRegister }: LoginComponentProps) => {
  const { user, supabaseUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(showRegister ? 'register' : 'login');
  
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
          type="button"
          onClick={() => {
            console.log('Back arrow clicked');
            navigate('/');
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-50"
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
