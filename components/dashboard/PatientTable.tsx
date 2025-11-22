import React from 'react';
import { Patient } from '../../types';
import { format } from 'date-fns';

interface PatientTableProps {
  data: Patient[];
}

export const PatientTable: React.FC<PatientTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="text-center py-12 text-gray-500">No records found.</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#9F6449]/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F5EAE6] text-[#9F6449] border-b-2 border-[#9F6449]">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Mobile</th>
              <th className="px-6 py-4 font-semibold">Visit Type</th>
              <th className="px-6 py-4 font-semibold">Reason</th>
              <th className="px-6 py-4 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((patient) => (
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
                <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate" title={patient.reason}>
                  {patient.reason}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {patient.leadSource}
                  {patient.leadSource === 'Other' && patient.otherSourceDetails && (
                    <span className="text-gray-400 text-xs block">{patient.otherSourceDetails}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};