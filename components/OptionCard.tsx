import React from 'react';

interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const OptionCard: React.FC<OptionCardProps> = ({ label, selected, onClick, icon }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3
        ${selected 
          ? 'border-[#A1534E] bg-white text-[#A1534E] shadow-md' 
          : 'border-gray-100 bg-white hover:border-[#A1534E]/30 text-gray-700 shadow-sm'
        }
      `}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="font-medium text-lg">{label}</span>
      {selected && (
        <div className="ml-auto text-[#A1534E]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};
