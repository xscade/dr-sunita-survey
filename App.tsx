import React, { useState, useEffect } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { Button } from './components/Button';
import { OptionCard } from './components/OptionCard';
import { Dashboard } from './components/dashboard/Dashboard';
import { 
  PatientFormData, 
  VisitType, 
  ReasonForVisit, 
  LeadSource, 
  AdType 
} from './types';
import { generateWelcomeMessage } from './services/geminiService';

// --- Slide Components ---

// Slide 1: Welcome
const WelcomeSlide = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
    <div className="w-24 h-24 bg-[#F5EAE6] border-2 border-[#9F6449]/20 rounded-full flex items-center justify-center mb-4 text-4xl">
      🦷
    </div>
    <h1 className="text-4xl font-bold text-slate-900">Welcome to<br/><span className="text-[#9F6449]">Krest Dental</span></h1>
    <p className="text-lg text-gray-500 max-w-xs mx-auto">We're happy to see you! Please fill out these quick details to check in.</p>
    <div className="w-full max-w-md pt-8">
      <Button fullWidth onClick={onNext} className="text-lg py-4">Start Check-in</Button>
    </div>
  </div>
);

// Slide 2: Visit Type
const VisitTypeSlide = ({ data, updateData, onNext }: any) => {
  const options = [
    { label: "Yes, it's my first time", value: VisitType.FirstTime },
    { label: "No, I've visited before", value: VisitType.Returning },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Is this your first visit to Krest Dental?</h2>
      <div className="space-y-3">
        {options.map((opt) => (
          <OptionCard 
            key={opt.value}
            label={opt.label}
            selected={data.visitType === opt.value}
            onClick={() => {
              updateData({ visitType: opt.value });
              setTimeout(onNext, 250);
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Slide 3: Name
const NameSlide = ({ data, updateData, onNext }: any) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">What is your full name?</h2>
    <input
      type="text"
      placeholder="e.g. John Doe"
      className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-[#9F6449] focus:ring-0 outline-none transition-colors"
      value={data.fullName}
      onChange={(e) => updateData({ fullName: e.target.value })}
      autoFocus
    />
    <Button 
      fullWidth 
      onClick={onNext} 
      disabled={!data.fullName || data.fullName.length < 2}
    >
      Next
    </Button>
  </div>
);

// Slide 4: Mobile
const MobileSlide = ({ data, updateData, onNext }: any) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Your mobile number?</h2>
    <input
      type="tel"
      placeholder="1234567890"
      className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-[#9F6449] focus:ring-0 outline-none transition-colors"
      value={data.mobileNumber}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, '');
        updateData({ mobileNumber: val });
      }}
      autoFocus
    />
    <Button 
      fullWidth 
      onClick={onNext} 
      disabled={!data.mobileNumber || data.mobileNumber.length < 10}
    >
      Next
    </Button>
  </div>
);

// Slide 5: Reason
const ReasonSlide = ({ data, updateData, onNext }: any) => {
  const reasons = Object.values(ReasonForVisit);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">What brings you in today?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {reasons.map((r) => (
          <OptionCard 
            key={r}
            label={r}
            selected={data.reason === r}
            onClick={() => {
              updateData({ reason: r });
              setTimeout(onNext, 250);
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Slide 6: Lead Source
const SourceSlide = ({ data, updateData, onNext }: any) => {
  const sources = Object.values(LeadSource);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">How did you hear about us?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {sources.map((s) => (
          <OptionCard 
            key={s}
            label={s}
            selected={data.leadSource === s}
            onClick={() => {
              updateData({ leadSource: s });
              if (s === LeadSource.Other) return;
              setTimeout(onNext, 250);
            }}
          />
        ))}
      </div>
      
      {data.leadSource === LeadSource.Other && (
        <div className="animate-fade-in">
          <input
            type="text"
            placeholder="Please specify..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl mt-2 focus:border-[#9F6449] focus:ring-0 outline-none"
            value={data.otherSourceDetails || ''}
            onChange={(e) => updateData({ otherSourceDetails: e.target.value })}
          />
          <div className="mt-4">
            <Button fullWidth onClick={onNext}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Slide 7: Ad Attribution
const AttributionSlide = ({ data, updateData, onNext }: any) => {
  const ads = Object.values(AdType);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Did you click on any of these ads?</h2>
      <p className="text-gray-500 text-sm">Helping us understand what works!</p>
      <div className="space-y-3">
        {ads.map((ad) => (
          <OptionCard 
            key={ad}
            label={ad}
            selected={data.adAttribution === ad}
            onClick={() => {
              updateData({ adAttribution: ad });
              setTimeout(onNext, 250);
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Slide 8: Thank You
const ThankYouSlide = ({ data }: { data: PatientFormData }) => {
  const [message, setMessage] = useState("Thank you! Our team will assist you shortly.");
  const [generatingMsg, setGeneratingMsg] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'success' | 'error'>('saving');

  useEffect(() => {
    let isMounted = true;

    const fetchMessage = async () => {
      if (data.fullName && data.reason) {
        const msg = await generateWelcomeMessage(data.fullName, data.reason);
        if (isMounted) {
          setMessage(msg);
          setGeneratingMsg(false);
        }
      } else {
        if (isMounted) setGeneratingMsg(false);
      }
    };

    const saveData = async () => {
      try {
        const response = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          if (isMounted) setSaveStatus('success');
        } else {
          throw new Error("Server responded with error");
        }
      } catch (error) {
        console.error("Failed to save data:", error);
        if (isMounted) setSaveStatus('error');
      }
    };

    fetchMessage();
    saveData();

    return () => { isMounted = false; };
  }, [data]);

  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
      <div className="w-24 h-24 bg-[#F5EAE6] text-[#9F6449] rounded-full flex items-center justify-center mb-4 text-4xl border-2 border-[#9F6449]/20">
        ✓
      </div>
      <h1 className="text-3xl font-bold text-slate-900">All Set!</h1>
      
      <div className="min-h-[80px] flex items-center justify-center">
        {generatingMsg ? (
           <div className="flex flex-col items-center">
             <div className="w-5 h-5 border-2 border-[#9F6449] border-t-transparent rounded-full animate-spin mb-2"></div>
             <p className="text-gray-400 text-sm">Personalizing message...</p>
           </div>
        ) : (
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed transition-all duration-500">
            {message}
          </p>
        )}
      </div>

      <div className="text-sm pt-4">
        {saveStatus === 'saving' && <span className="text-gray-400">Saving your details...</span>}
        {saveStatus === 'success' && <span className="text-green-600 font-medium flex items-center gap-1">✓ Details saved securely</span>}
        {saveStatus === 'error' && <span className="text-amber-600 flex items-center gap-1">⚠ Could not connect to database</span>}
      </div>

      <div className="pt-8 w-full">
        <Button variant="outline" fullWidth onClick={() => window.location.reload()}>
          Start New Check-in
        </Button>
      </div>
    </div>
  );
};

// --- Main Survey App Component ---
const SurveyApp = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: '',
    mobileNumber: '',
  });

  const updateData = (fields: Partial<PatientFormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const isAdSource = [LeadSource.GoogleAds, LeadSource.Instagram, LeadSource.Facebook].includes(formData.leadSource as LeadSource);
  
  const handleNext = () => {
    if (currentSlide === 5) {
      if (isAdSource) {
        setCurrentSlide(6);
      } else {
        setCurrentSlide(7);
      }
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide === 0) return;
    
    if (currentSlide === 7) {
      setCurrentSlide(isAdSource ? 6 : 5);
    } else if (currentSlide === 6) {
      setCurrentSlide(5);
    } else {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const totalSteps = isAdSource ? 8 : 7;

  useEffect(() => {
    window.scrollTo(0,0);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-[#F5EAE6] flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {currentSlide > 0 && currentSlide < 7 && (
        <ProgressBar currentStep={currentSlide} totalSteps={totalSteps} />
      )}

      <div className="w-full max-w-lg mb-6 flex justify-between items-center h-8">
        {currentSlide > 0 ? (
          <div className="text-xl font-bold text-[#9F6449] tracking-tight">Krest Dental</div>
        ) : (
          <div></div>
        )}
        {currentSlide > 0 && currentSlide < 7 && (
           <button onClick={handlePrev} className="text-gray-400 hover:text-gray-600 text-sm font-medium">
             Back
           </button>
        )}
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 min-h-[400px] flex flex-col justify-center relative">
        {currentSlide === 0 && <WelcomeSlide onNext={handleNext} />}
        {currentSlide === 1 && <VisitTypeSlide data={formData} updateData={updateData} onNext={handleNext} />}
        {currentSlide === 2 && <NameSlide data={formData} updateData={updateData} onNext={handleNext} />}
        {currentSlide === 3 && <MobileSlide data={formData} updateData={updateData} onNext={handleNext} />}
        {currentSlide === 4 && <ReasonSlide data={formData} updateData={updateData} onNext={handleNext} />}
        {currentSlide === 5 && <SourceSlide data={formData} updateData={updateData} onNext={handleNext} />}
        {currentSlide === 6 && <AttributionSlide data={formData} updateData={updateData} onNext={handleNext} />}
        {currentSlide === 7 && <ThankYouSlide data={formData} />}
      </div>

      <div className="mt-8 text-center text-xs text-gray-400 flex flex-col gap-2">
        <span>&copy; {new Date().getFullYear()} Krest Dental Clinic</span>
        <a href="/dashboard" className="text-[#9F6449]/40 hover:text-[#9F6449] transition-colors">Admin Login</a>
      </div>
    </div>
  );
};

// --- Root App with Simple Routing ---
export default function App() {
  const [view, setView] = useState<'survey' | 'dashboard'>('survey');

  useEffect(() => {
    if (window.location.pathname === '/dashboard') {
      setView('dashboard');
    } else {
      setView('survey');
    }
  }, []);

  if (view === 'dashboard') {
    return <Dashboard />;
  }

  return <SurveyApp />;
}