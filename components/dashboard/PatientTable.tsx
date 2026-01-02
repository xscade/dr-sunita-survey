'use client';

import React, { useState } from 'react';
import { Patient } from '@/types';
import { format } from 'date-fns';
import { Search } from 'lucide-react';

interface PatientTableProps {
  data: Patient[];
}

export const PatientTable: React.FC<PatientTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = patient.fullName?.toLowerCase().includes(term) || false;
    const mobileMatch = patient.mobileNumber?.includes(term) || false;
    const categoryMatch = patient.selectedCategory?.toLowerCase().includes(term) || false;
    const reasonMatch = patient.reason?.toLowerCase().includes(term) || false;
    return nameMatch || mobileMatch || categoryMatch || reasonMatch;
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-[#A1534E] focus:ring-0 transition-colors sm:text-sm"
          placeholder="Search by name, mobile, category, or reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#A1534E]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-[#A1534E] border-2 border-[#A1534E]">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Mobile</th>
                <th className="px-6 py-4 font-semibold">Visit Type</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Reason</th>
                <th className="px-6 py-4 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {patient.submittedAt ? format(new Date(patient.submittedAt), 'MMM d, h:mm a') : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{patient.fullName}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.mobileNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        patient.visitType === 'First-Time' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {patient.visitType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {patient.selectedCategory ? (
                        <span className="px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 font-medium">
                          {patient.selectedCategory}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate" title={patient.reason}>
                      {patient.reason || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {patient.leadSource}
                      {patient.leadSource === 'Other' && patient.otherSourceDetails && (
                        <span className="text-gray-400 text-xs block">{patient.otherSourceDetails}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {data.length === 0 ? "No records found." : "No matching results found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
