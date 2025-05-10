import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
        <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-10 text-white">
        <p className="text-sm text-gray-300 mb-6">Last updated: 2025.05.09</p>
        <p className="mb-4">At SportsLinked, your privacy is important to us. This policy explains what data we collect, why we collect it, and how we handle it.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. What information we collect</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Name</li>
          <li>Email address</li>
          <li>Payment information (via third-party providers)</li>
          <li>Technical info like device ID and IP address</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. How we use your data</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Create and manage your account</li>
          <li>Provide and improve our services</li>
          <li>Communicate with you (e.g., notifications and emails)</li>
          <li>Handle payments via external payment processors</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Third-party sharing</h2>
        <p className="mb-4">We do not sell your data. We only share it with:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Payment providers (for subscriptions)</li>
          <li>Technical service providers (for app functionality)</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies</h2>
        <p className="mb-4">We currently do not use cookies. If this changes, we will update this policy.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Data storage and security</h2>
        <p className="mb-4">We store your data as long as your account is active. We use reasonable technical and organizational measures to protect it.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Your rights</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Request access to your data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p className="mb-4">Contact us at <a href="mailto:info@sportslinked.com" className="underline text-blue-300">info@sportslinked.com</a> to exercise your rights.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to this policy</h2>
        <p className="mb-4">We may update this policy. You will be notified of major changes via the app or email.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 