'use client';

import { useState, useEffect, useRef } from 'react';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/Button';
import { OptionCard } from '@/components/OptionCard';
import { 
  PatientFormData, 
  VisitType, 
  AdType,
  SlideProps,
  DEFAULT_REASONS,
  DEFAULT_SOURCES,
  AD_SOURCES,
  ReasonCategory
} from '@/types';

// Slide Components
const WelcomeSlide = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
    <div className="w-24 h-24 bg-white border-2 border-[#A1534E]/20 rounded-full flex items-center justify-center mb-4 text-4xl">
      ✨
    </div>
    <h1 className="text-4xl font-bold text-slate-900">Welcome to<br/><span className="text-[#A1534E]">Dr Sunita Aesthetics</span></h1>
    <p className="text-lg text-gray-500 max-w-xs mx-auto">We're happy to see you! Please fill out these quick details to check in.</p>
    <div className="w-full max-w-md pt-8">
      <Button fullWidth onClick={onNext} className="text-lg py-4">Start Check-in</Button>
    </div>
  </div>
);

const VisitTypeSlide = ({ data, updateData, onNext }: SlideProps) => {
  const options = [
    { label: "Yes, it's my first time", value: VisitType.FirstTime },
    { label: "No, I've visited before", value: VisitType.Returning },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Is this your first visit to Dr Sunita Aesthetics?</h2>
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

const NameSlide = ({ data, updateData, onNext }: SlideProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">What is your full name?</h2>
    <input
      type="text"
      placeholder="e.g. John Doe"
      className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-[#A1534E] focus:ring-0 outline-none transition-colors"
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

// Phone lookup slide for returning visitors
const PhoneLookupSlide = ({ data, updateData, onNext, onFound, onNotFound }: {
  data: PatientFormData;
  updateData: (fields: Partial<PatientFormData>) => void;
  onNext: () => void;
  onFound: (name: string) => void;
  onNotFound: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    if (!data.mobileNumber || data.mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/patients/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: data.mobileNumber }),
      });

      const result = await res.json();

      if (result.found) {
        // Patient found - greet with name
        updateData({ fullName: result.fullName });
        onFound(result.fullName);
      } else {
        // Patient not found - ask for name
        onNotFound();
      }
    } catch (err) {
      console.error('Lookup error:', err);
      setError('Unable to verify. Please continue with your details.');
      // On error, continue as if not found
      setTimeout(() => {
        onNotFound();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Please enter your mobile number</h2>
      <p className="text-gray-500 text-sm">We'll look up your previous visit details</p>
      <input
        type="tel"
        placeholder="1234567890"
        className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-[#A1534E] focus:ring-0 outline-none transition-colors"
        value={data.mobileNumber}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '');
          updateData({ mobileNumber: val });
          setError('');
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !loading && data.mobileNumber && data.mobileNumber.length >= 10) {
            handleLookup();
          }
        }}
        autoFocus
        disabled={loading}
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <Button 
        fullWidth 
        onClick={handleLookup} 
        disabled={!data.mobileNumber || data.mobileNumber.length < 10 || loading}
      >
        {loading ? 'Looking up...' : 'Continue'}
      </Button>
    </div>
  );
};

// Greeting slide when returning patient is found
const ReturningPatientGreetingSlide = ({ name, onNext }: { name: string; onNext: () => void }) => {
  useEffect(() => {
    // Auto-advance after 2 seconds
    const timer = setTimeout(() => {
      onNext();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
      <div className="w-20 h-20 bg-[#A1534E]/10 text-[#A1534E] rounded-full flex items-center justify-center mb-4 text-3xl">
        👋
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Welcome back, {name}!</h2>
      <p className="text-gray-600">We're glad to see you again.</p>
      <div className="pt-4">
        <Button fullWidth onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
};

const MobileSlide = ({ data, updateData, onNext }: SlideProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Your mobile number?</h2>
    <input
      type="tel"
      placeholder="1234567890"
      className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-[#A1534E] focus:ring-0 outline-none transition-colors"
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

// Step 1: Category Selection
const CategorySelectionSlide = ({ data, updateData, onNext, options }: SlideProps) => {
  // Handle both old format (string array) and new format (categorized)
  let categories: ReasonCategory[] = DEFAULT_REASONS;
  
  if (options && Array.isArray(options) && options.length > 0) {
    const firstItem = options[0];
    if (typeof firstItem === 'string') {
      // Old format - convert to categorized
      categories = [{ name: 'General', items: options as string[] }];
    } else {
      // New format - already categorized
      categories = options as ReasonCategory[];
    }
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">What brings you in today?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {categories.map((category) => (
          <OptionCard 
            key={category.name}
            label={category.name}
            selected={data.selectedCategory === category.name}
            onClick={() => {
              updateData({ selectedCategory: category.name });
              setTimeout(onNext, 250);
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Step 2: Reason Selection within Selected Category
const ReasonSelectionSlide = ({ data, updateData, onNext, onPrev, options }: SlideProps) => {
  // Handle both old format (string array) and new format (categorized)
  let categories: ReasonCategory[] = DEFAULT_REASONS;
  
  if (options && options.length > 0) {
    const firstItem = options[0];
    if (typeof firstItem === 'string') {
      // Old format - convert to categorized
      categories = [{ name: 'General', items: options as string[] }];
    } else {
      // New format - already categorized
      categories = options as ReasonCategory[];
    }
  }
  
  // Find the selected category
  const selectedCategory = categories.find(cat => cat.name === data.selectedCategory);
  
  if (!selectedCategory) {
    // Fallback if category not found
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Error: Category not found</h2>
        <Button onClick={onPrev}>Go Back</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <span>{selectedCategory.name}</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Select a specific procedure</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {selectedCategory.items.map((item) => (
          <OptionCard 
            key={item}
            label={item}
            selected={data.reason === item}
            onClick={() => {
              updateData({ reason: item });
              setTimeout(onNext, 250);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const SourceSlide = ({ data, updateData, onNext, options }: SlideProps) => {
  // Type guard: ensure options is a string array (sources, not categories)
  const sources: string[] = options && Array.isArray(options) && options.length > 0 && typeof options[0] === 'string' 
    ? (options as string[]) 
    : DEFAULT_SOURCES;
  const displaySources = sources.filter(s => s !== 'Other');
  displaySources.push('Other');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">How did you hear about us?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {displaySources.map((s) => (
          <OptionCard 
            key={s}
            label={s}
            selected={data.leadSource === s}
            onClick={() => {
              updateData({ leadSource: s });
              if (s === 'Other') return;
              setTimeout(onNext, 250);
            }}
          />
        ))}
      </div>
      
      {data.leadSource === 'Other' && (
        <div className="animate-fade-in">
          <input
            type="text"
            placeholder="Please specify..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl mt-2 focus:border-[#A1534E] focus:ring-0 outline-none"
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

const AttributionSlide = ({ data, updateData, onNext }: SlideProps) => {
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

const GoogleDetailSlide = ({ updateData, onNext }: { updateData: (fields: Partial<PatientFormData>) => void, onNext: () => void }) => {
  return (
    <div className="space-y-8 h-full flex flex-col justify-center">
      <h2 className="text-2xl font-bold text-slate-900 text-center">How did you find us on Google?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div 
          className="group cursor-pointer relative flex flex-col items-center gap-4 transition-transform duration-300 hover:scale-[1.02]"
          onClick={() => {
            updateData({ leadSource: 'Google Ads' });
            setTimeout(onNext, 250);
          }}
        >
          <div className="w-full aspect-[9/16] bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative border-2 border-transparent hover:border-[#A1534E]/30">
            <img 
              src="https://storage.googleapis.com/client-web-files/dr-sunita-aesthetics/google%20ads.PNG" 
              alt="Google Ads" 
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-gray-700 group-hover:border-[#A1534E] group-hover:text-[#A1534E] transition-colors">
            Sponsored Ad
          </div>
        </div>

        <div 
          className="group cursor-pointer relative flex flex-col items-center gap-4 transition-transform duration-300 hover:scale-[1.02]"
          onClick={() => {
            updateData({ leadSource: 'Practo' });
            setTimeout(onNext, 250);
          }}
        >
          <div className="w-full aspect-[9/16] bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative border-2 border-transparent hover:border-[#A1534E]/30">
            <video 
              src="https://storage.googleapis.com/client-web-files/dr-sunita-aesthetics/New%20Video%202%20Screens.mov"
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-gray-700 group-hover:border-[#A1534E] group-hover:text-[#A1534E] transition-colors">
            Practo Listing
          </div>
        </div>
      </div>
    </div>
  );
};

const ThankYouSlide = ({ data, saveStatus }: { data: PatientFormData; saveStatus: 'saving' | 'success' | 'error' }) => {

  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
      <div className="w-24 h-24 bg-white text-[#A1534E] rounded-full flex items-center justify-center mb-4 text-4xl border-2 border-[#A1534E]/20">
        ✓
      </div>
      <h1 className="text-3xl font-bold text-slate-900">All Set!</h1>
      
      <div className="min-h-[80px] flex items-center justify-center">
        <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed transition-all duration-500">
          Thank you, {data.fullName}! Our team will assist you shortly.
        </p>
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

const SurveyApp = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: '',
    mobileNumber: '',
  });
  const [options, setOptions] = useState<{reasons: ReasonCategory[] | string[], sources: string[]} | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'success' | 'error'>('saving');
  const [returningPatientName, setReturningPatientName] = useState<string>('');
  const hasSavedRef = useRef(false);

  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('/api/options');
        if (res.ok) {
          const data = await res.json();
          if (data.reasons && data.sources) {
            // Handle migration from old format
            if (Array.isArray(data.reasons) && data.reasons.length > 0) {
              const firstItem = data.reasons[0];
              if (typeof firstItem === 'string') {
                data.reasons = [{ name: 'General', items: data.reasons }];
              }
            }
            setOptions(data);
          }
        }
      } catch (e) {
        console.error("Using default options due to fetch error", e);
      }
    };
    fetchOptions();
  }, []);

  const updateData = (fields: Partial<PatientFormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const isAdSource = AD_SOURCES.includes(formData.leadSource || '');
  
  const savePatientData = async (data: PatientFormData) => {
    // Prevent duplicate saves
    if (hasSavedRef.current) {
      return;
    }
    
    hasSavedRef.current = true;
    setSaveStatus('saving');

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSaveStatus('success');
      } else {
        throw new Error("Server responded with error");
      }
    } catch (error) {
      console.error("Failed to save data:", error);
      setSaveStatus('error');
      hasSavedRef.current = false; // Allow retry on error
    }
  };

  const handleNext = () => {
    const currentData = formDataRef.current;
    const currentIsAdSource = AD_SOURCES.includes(currentData.leadSource || '');

    if (currentSlide === 1) {
      // After visit type selection
      if (currentData.visitType === VisitType.Returning) {
        // Returning visitor - go to phone lookup
        setCurrentSlide(12);
      } else {
        // First time - go to name
        setCurrentSlide(2);
      }
    } else if (currentSlide === 2) {
      // After name slide
      if (currentData.visitType === VisitType.Returning && currentData.mobileNumber) {
        // Returning visitor who wasn't found - already has mobile, skip mobile slide
        setCurrentSlide(4);
      } else {
        // First time visitor - go to mobile
        setCurrentSlide(3);
      }
    } else if (currentSlide === 4) {
      // After category selection, go to reason selection
      setCurrentSlide(11);
    } else if (currentSlide === 11) {
      // After reason selection, go to source selection
      setCurrentSlide(5);
    } else if (currentSlide === 5) {
      // Before going to thank you slide, save the data
      savePatientData(currentData);
      setCurrentSlide(7);
    } else if (currentSlide === 13) {
      // After greeting slide, go to category selection
      setCurrentSlide(4);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePhoneLookupFound = (name: string) => {
    setReturningPatientName(name);
    setCurrentSlide(13); // Go to greeting slide
  };

  const handlePhoneLookupNotFound = () => {
    // Not found - ask for name, then mobile (but mobile is already entered)
    // Skip mobile slide since we already have it, go to name then category
    setCurrentSlide(2); // Go to name slide
  };

  const handlePrev = () => {
    const currentData = formDataRef.current;
    const currentIsAdSource = AD_SOURCES.includes(currentData.leadSource || '');

    if (currentSlide === 0) return;
    
    if (currentSlide === 2) {
      // From name slide, check if we came from returning visitor flow
      if (currentData.visitType === VisitType.Returning) {
        setCurrentSlide(12); // Go back to phone lookup
      } else {
        setCurrentSlide(1); // Go back to visit type
      }
    } else if (currentSlide === 12) {
      // From phone lookup, go back to visit type
      setCurrentSlide(1);
    } else if (currentSlide === 13) {
      // From greeting, go back to phone lookup
      setCurrentSlide(12);
    } else if (currentSlide === 11) {
      // From reason selection, go back to category selection
      setCurrentSlide(4);
    } else if (currentSlide === 7) {
      // From thank you, go back to source selection
      setCurrentSlide(5);
    } else if (currentSlide === 5) {
      // From source selection, go back to reason selection
      setCurrentSlide(11);
    } else if (currentSlide === 4) {
      // From category selection, check if returning visitor
      if (currentData.visitType === VisitType.Returning && returningPatientName) {
        setCurrentSlide(13); // Go back to greeting
      } else {
        setCurrentSlide(2); // Go back to name
      }
    } else {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const totalSteps = 6;

  useEffect(() => {
    window.scrollTo(0,0);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {currentSlide > 0 && currentSlide < 7 && currentSlide !== 11 && currentSlide !== 12 && currentSlide !== 13 && (
        <ProgressBar currentStep={currentSlide > 11 ? currentSlide - 1 : currentSlide} totalSteps={totalSteps} />
      )}

      <div className="w-full max-w-lg mb-6 flex justify-between items-center h-8">
        {currentSlide > 0 ? (
          <div className="text-xl font-bold text-[#A1534E] tracking-tight">Dr Sunita Aesthetics</div>
        ) : (
          <div></div>
        )}
        {(currentSlide > 0 && currentSlide < 7) || currentSlide === 11 || currentSlide === 12 || currentSlide === 13 ? (
           <button onClick={handlePrev} className="text-gray-400 hover:text-gray-600 text-sm font-medium">
             Back
           </button>
        ) : null}
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 min-h-[400px] flex flex-col justify-center relative">
        {currentSlide === 0 && <WelcomeSlide onNext={handleNext} />}
        {currentSlide === 1 && <VisitTypeSlide data={formData} updateData={updateData} onNext={handleNext} onPrev={handlePrev} />}
        {currentSlide === 2 && <NameSlide data={formData} updateData={updateData} onNext={handleNext} onPrev={handlePrev} />}
        {currentSlide === 3 && <MobileSlide data={formData} updateData={updateData} onNext={handleNext} onPrev={handlePrev} />}
        {currentSlide === 12 && <PhoneLookupSlide data={formData} updateData={updateData} onNext={handleNext} onFound={handlePhoneLookupFound} onNotFound={handlePhoneLookupNotFound} />}
        {currentSlide === 13 && <ReturningPatientGreetingSlide name={returningPatientName} onNext={handleNext} />}
        {currentSlide === 4 && <CategorySelectionSlide data={formData} updateData={updateData} onNext={handleNext} onPrev={handlePrev} options={options?.reasons as ReasonCategory[]} />}
        {currentSlide === 11 && <ReasonSelectionSlide data={formData} updateData={updateData} onNext={handleNext} onPrev={handlePrev} options={options?.reasons as ReasonCategory[]} />}
        {currentSlide === 5 && <SourceSlide data={formData} updateData={updateData} onNext={handleNext} onPrev={handlePrev} options={options?.sources} />}
        {currentSlide === 7 && <ThankYouSlide data={formData} saveStatus={saveStatus} />}
      </div>

      <div className="mt-8 text-center text-xs text-gray-400 flex flex-col gap-2">
        <span>&copy; {new Date().getFullYear()} Dr Sunita Aesthetics</span>
        <a href="/dashboard" className="text-[#A1534E]/40 hover:text-[#A1534E] transition-colors">Admin Login</a>
      </div>
    </div>
  );
};

export default function Home() {
  return <SurveyApp />;
}

