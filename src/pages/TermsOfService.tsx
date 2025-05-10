import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#102a37' }}>
      <div className="sticky top-0 z-40 flex items-center bg-[#102a37] px-4 py-4">
        <button
          onClick={() => navigate('/settings')}
          className="mr-4 text-white hover:text-blue-300"
          aria-label="Back"
        >
          <ArrowLeft size={32} />
        </button>
        <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-10 text-white">
        <p className="text-sm text-gray-300 mb-6">Last updated: 2025.05.09</p>
        <p className="mb-4">Welcome to SportsLinked! By using our app, you agree to the following terms of service. Please read them carefully.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Purpose of the Service</h2>
        <p className="mb-4">SportsLinked is a social platform connecting athletes, scouts, and clubs. We provide tools for athletes to showcase their talent for scouts to find new prospects. Clubs can also use the platform for invitations and posts for tryouts and events.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. User Account</h2>
        <p className="mb-4">To use SportsLinked, you must create an account with accurate information, including your name and email. You are responsible for keeping your account secure.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. User Conduct</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Upload inappropriate, offensive, or misleading content</li>
          <li>Harass, threaten, or insult other users</li>
          <li>Violate any applicable laws</li>
          <li>Impersonate others</li>
        </ul>
        <p className="mb-4">We reserve the right to suspend or delete accounts that violate these rules.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Subscriptions and Payments</h2>
        <p className="mb-4">Some features are available through paid subscriptions. All payments are processed securely via third-party providers. SportsLinked does not store your payment details.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Disclaimer</h2>
        <p className="mb-4">We cannot guarantee that contacts, events, or opportunities on the platform will lead to professional engagements. Users are responsible for their own interactions.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
        <p className="mb-4">We reserve the right to update these terms at any time. You will be notified of significant changes.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact</h2>
        <p className="mb-4">For questions, email us at: <a href="mailto:info@sportslinked.com" className="underline text-blue-300">info@sportslinked.com</a></p>
      </div>
    </div>
  );
};

export default TermsOfService; 