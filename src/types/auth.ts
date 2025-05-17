
import { UserRole } from "@/context/AuthContext";

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  sport: string;
  position: string[];
  experience: string;
  teamSize: string;
  teamType: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  division: string;
  yearsPlayed: string;
  dominantFoot: string;
  weight: string;
  height: string;
  latestClub: string;
}
