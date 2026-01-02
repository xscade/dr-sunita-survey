'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Trash2, Plus, Save, Loader2, Edit2, X } from 'lucide-react';
import { FormOptions, ReasonCategory } from '@/types';

export const Settings = () => {
  const [options, setOptions] = useState<FormOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newReason, setNewReason] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [newSource, setNewSource] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await fetch('/api/options');
      if (res.ok) {
        const data = await res.json();
        // Handle migration from old format
        if (data.reasons && Array.isArray(data.reasons) && data.reasons.length > 0) {
          const firstItem = data.reasons[0];
          if (typeof firstItem === 'string') {
            data.reasons = [{ name: 'General', items: data.reasons }];
          }
        }
        setOptions(data);
      }
    } catch (error) {
      console.error('Failed to fetch options', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOptions = async (updatedOptions: FormOptions) => {
    setSaving(true);
    try {
      await fetch('/api/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOptions),
      });
      setOptions(updatedOptions);
    } catch (error) {
      console.error('Failed to save options', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim() || !options) return;
    const updated = { 
      ...options, 
      reasons: [...options.reasons, { name: newCategory.trim(), items: [] }] 
    };
    saveOptions(updated);
    setNewCategory('');
  };

  const handleDeleteCategory = (index: number) => {
    if (!options) return;
    const updated = { 
      ...options, 
      reasons: options.reasons.filter((_, i) => i !== index) 
    };
    saveOptions(updated);
  };

  const handleStartEditCategory = (index: number) => {
    if (!options) return;
    setEditingCategory(index);
    setEditingCategoryName(options.reasons[index].name);
  };

  const handleSaveCategoryName = (index: number) => {
    if (!options || !editingCategoryName.trim()) return;
    const updated = { ...options };
    updated.reasons[index].name = editingCategoryName.trim();
    saveOptions(updated);
    setEditingCategory(null);
    setEditingCategoryName('');
  };

  const handleAddReason = (categoryIndex: number) => {
    if (!newReason.trim() || !options) return;
    const updated = { ...options };
    updated.reasons[categoryIndex].items.push(newReason.trim());
    saveOptions(updated);
    setNewReason('');
    setSelectedCategory(null);
  };

  const handleDeleteReason = (categoryIndex: number, itemIndex: number) => {
    if (!options) return;
    const updated = { ...options };
    updated.reasons[categoryIndex].items = updated.reasons[categoryIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    saveOptions(updated);
  };

  const handleAddSource = () => {
    if (!newSource.trim() || !options) return;
    const updated = { ...options, sources: [...options.sources, newSource.trim()] };
    saveOptions(updated);
    setNewSource('');
  };

  const handleDeleteSource = (index: number) => {
    if (!options) return;
    const updated = { ...options, sources: options.sources.filter((_, i) => i !== index) };
    saveOptions(updated);
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#A1534E]" /></div>;
  if (!options) return <div>Error loading settings</div>;

  return (
    <div className="space-y-8">
      {/* Visit Reasons Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#A1534E]/10">
        <h3 className="text-lg font-bold text-[#A1534E] mb-4 flex items-center gap-2">
          Manage Visit Reasons (Categorized)
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        </h3>
        
        {/* Add New Category */}
        <div className="flex gap-2 mb-6 pb-6 border-b border-gray-200">
          <input 
            type="text" 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category..."
            className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:border-[#A1534E] outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button 
            onClick={handleAddCategory} 
            className="bg-[#A1534E] text-white px-4 py-2 rounded-lg hover:bg-[#8A4541] flex items-center gap-2"
          >
            <Plus size={20} /> Add Category
          </button>
        </div>

        {/* Categories List */}
        <div className="space-y-6">
          {options.reasons.map((category, catIdx) => (
            <div key={catIdx} className="border border-gray-200 rounded-lg p-4">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                {editingCategory === catIdx ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="flex-1 p-2 border-2 border-[#A1534E] rounded-lg outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveCategoryName(catIdx)}
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveCategoryName(catIdx)}
                      className="text-[#A1534E] hover:text-[#8A4541]"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setEditingCategoryName('');
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="text-base font-semibold text-gray-800">{category.name}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEditCategory(catIdx)}
                        className="text-gray-400 hover:text-[#A1534E] transition-colors"
                        title="Edit category name"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(catIdx)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Add Item to Category */}
              {selectedCategory === catIdx ? (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="Add new reason..."
                    className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:border-[#A1534E] outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddReason(catIdx)}
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddReason(catIdx)}
                    className="bg-[#A1534E] text-white p-2 rounded-lg hover:bg-[#8A4541]"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setNewReason('');
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedCategory(catIdx)}
                  className="mb-3 text-sm text-[#A1534E] hover:text-[#8A4541] flex items-center gap-1"
                >
                  <Plus size={16} /> Add reason to this category
                </button>
              )}

              {/* Category Items */}
              <div className="space-y-2">
                {category.items.length > 0 ? (
                  category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
                      <span className="text-gray-700">{item}</span>
                      <button
                        onClick={() => handleDeleteReason(catIdx, itemIdx)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">No reasons in this category yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Sources Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#A1534E]/10">
        <h3 className="text-lg font-bold text-[#A1534E] mb-4 flex items-center gap-2">
          Manage Lead Sources
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        </h3>

        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Add new source..."
            className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:border-[#A1534E] outline-none"
          />
          <button onClick={handleAddSource} className="bg-[#A1534E] text-white p-2 rounded-lg hover:bg-[#8A4541]">
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {options.sources.map((source, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
              <span className="text-gray-700">{source}</span>
              {source !== 'Other' && (
                <button 
                  onClick={() => handleDeleteSource(idx)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
