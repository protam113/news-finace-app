"use client";

import countryData from "../data/country.json";

interface FilterPanelProps {
  selectedCountries: string[];
  selectedImportance: string[];
  onCountriesChange: (countries: string[]) => void;
  onImportanceChange: (importance: string[]) => void;
}

export default function FilterPanel({
  selectedCountries,
  selectedImportance,
  onCountriesChange,
  onImportanceChange,
}: FilterPanelProps) {
  const importanceLevels = [
    { value: 'high', label: 'High', color: 'text-red-500' },
    { value: 'medium', label: 'Medium', color: 'text-orange-500' },
    { value: 'low', label: 'Low', color: 'text-green-500' },
  ];

  const toggleCountry = (countryId: string) => {
    if (selectedCountries.includes(countryId)) {
      // Không cho phép bỏ chọn nếu chỉ còn 1 item
      if (selectedCountries.length > 1) {
        onCountriesChange(selectedCountries.filter(id => id !== countryId));
      }
    } else {
      onCountriesChange([...selectedCountries, countryId]);
    }
  };

  const toggleImportance = (level: string) => {
    if (selectedImportance.includes(level)) {
      // Không cho phép bỏ chọn nếu chỉ còn 1 item
      if (selectedImportance.length > 1) {
        onImportanceChange(selectedImportance.filter(l => l !== level));
      }
    } else {
      onImportanceChange([...selectedImportance, level]);
    }
  };

  const selectAllCountries = () => {
    onCountriesChange(countryData.map(c => c.country_id.toString()));
  };

  const clearAllCountries = () => {
    // Giữ lại ít nhất 1 country
    if (countryData.length > 0) {
      onCountriesChange([countryData[0].country_id.toString()]);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 space-y-4">
      {/* Importance Filter */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Impact Level
        </h3>
        <div className="flex flex-wrap gap-2">
          {importanceLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => toggleImportance(level.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedImportance.includes(level.value)
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-600'
              }`}
            >
              <span className={selectedImportance.includes(level.value) ? 'text-white' : level.color}>
                ★
              </span>{' '}
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Country Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Countries
          </h3>
          <div className="flex gap-2">
            <button
              onClick={selectAllCountries}
              className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              All
            </button>
            <button
              onClick={clearAllCountries}
              className="text-xs text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1">
          {countryData.map((country) => (
            <label
              key={country.country_id}
              className="flex items-center gap-2 p-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCountries.includes(country.country_id.toString())}
                onChange={() => toggleCountry(country.country_id.toString())}
                className="rounded border-zinc-300 dark:border-zinc-600"
              />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {country.currency}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {country.country}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
