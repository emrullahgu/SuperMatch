'use client';

import { useState } from 'react';
import { X, Filter as FilterIcon } from 'lucide-react';
import { Filter } from '@/shared/types';

interface FilterPanelProps {
  onClose: () => void;
  onApply: (filters: Filter) => void;
}

export function FilterPanel({ onClose, onApply }: FilterPanelProps) {
  const [gender, setGender] = useState<'male' | 'female' | 'any'>('any');
  const [ageRange, setAgeRange] = useState({ min: 18, max: 99 });
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');

  const handleApply = () => {
    const filters: Filter = {
      gender: gender === 'any' ? undefined : gender,
      ageRange: ageRange.min !== 18 || ageRange.max !== 99 ? ageRange : undefined,
      interests: interests.length > 0 ? interests : undefined,
    };
    onApply(filters);
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FilterIcon className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold">Filtreler</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Gender Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Cinsiyet</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setGender('any')}
              className={`py-2 rounded-lg ${
                gender === 'any'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Hepsi
            </button>
            <button
              onClick={() => setGender('male')}
              className={`py-2 rounded-lg ${
                gender === 'male'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Erkek
            </button>
            <button
              onClick={() => setGender('female')}
              className={`py-2 rounded-lg ${
                gender === 'female'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Kadın
            </button>
          </div>
        </div>

        {/* Age Range Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Yaş Aralığı</label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Min</label>
              <input
                type="number"
                value={ageRange.min}
                onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value) })}
                min="18"
                max="99"
                className="input-field"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max</label>
              <input
                type="number"
                value={ageRange.max}
                onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value) })}
                min="18"
                max="99"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Interests Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">İlgi Alanları</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              placeholder="İlgi alanı ekle..."
              className="input-field flex-1"
            />
            <button
              onClick={addInterest}
              type="button"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 rounded-lg"
            >
              Ekle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
              >
                <span>{interest}</span>
                <button
                  onClick={() => removeInterest(interest)}
                  className="hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          {interests.length === 0 && (
            <p className="text-xs text-gray-500 mt-2">
              İlgi alanlarınızı ekleyin, benzer ilgi alanları olan kişilerle eşleşin
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button onClick={handleApply} className="btn-primary flex-1">
            Uygula
          </button>
          <button onClick={onClose} className="btn-secondary flex-1">
            İptal
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Filtreler ne kadar spesifik olursa, eşleşme süresi o kadar uzun olabilir
        </p>
      </div>
    </div>
  );
}
