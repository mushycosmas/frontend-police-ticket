// Home.tsx (Refactored)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../components/common/Footer';
import { HeroSection } from '../../components/layouts/HeroSection';
import { ServicesSection } from '../../components/layouts/ServicesSection';
import { HowItWorksSection } from '../../components/layouts/HowItWorksSection';
import { ReportTicketModal } from '../../components/modals/ReportTicketModal';
import { TrackTicketModal } from '../../components/modals/TrackTicketModal';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'report' | 'track' | null>(null);

  const services = [
    "Submit support requests",
    "Report incidents and service issues",
    "Track the status of submitted tickets",
    "Receive updates and feedback from support teams",
    "Submit suggestions and recommendations",
    "Upload supporting documents and attachments",
    "Access a secure and user-friendly support platform"
  ];

  const steps = [
    { title: "Submit a Request", description: "Provide the required information and describe your issue, concern, or request in detail." },
    { title: "Ticket Creation", description: "A unique ticket number will be automatically generated for your request." },
    { title: "Review & Assignment", description: "Your ticket will be reviewed and assigned to the appropriate support team." },
    { title: "Investigation & Resolution", description: "The responsible team will investigate the issue and take the necessary actions to resolve it." },
    { title: "Feedback & Closure", description: "You will receive updates throughout the process and be notified once the ticket has been resolved." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <div>
        <HeroSection 
          title="Ticket Support System"
          subtitle="Welcome. Please fill out the form below to create a new support ticket. Our team is ready to assist you."
          activeTab={activeTab}
          onTabChange={setActiveTab}
         
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 mt-24 mb-24 space-y-24">
          <ServicesSection title="Our Services" services={services.map(text => ({ text }))} />
          <HowItWorksSection title="How It Works" steps={steps} />
        </div>
      </div>

      {activeTab === 'report' && (
        <ReportTicketModal onClose={() => setActiveTab(null)} />
      )}

      {activeTab === 'track' && (
        <TrackTicketModal onClose={() => setActiveTab(null)} />
      )}

     
    </div>
  );
};