'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/utils/api'; // Assuming this is your API utility

// Define the interface for filters to ensure type safety
interface TopicFilterProps {
  filters: {
    title: string;
    subject: string;
    status: string;
    domain: string;
    subdomain: string;
  };
  onFilterChange: (filters: TopicFilterProps['filters']) => void;
  showTitle?: boolean;
  showSubject?: boolean;
  showStatus?: boolean;
}

const TopicFilter: React.FC<TopicFilterProps> = ({
  filters,
  onFilterChange,
  showTitle = true,
  showSubject = true,
  showStatus = true,
}) => {
  // State to manage filters internally before propagating to parent
  const [localFilters, setLocalFilters] = useState(filters);
  const [domainOptions, setDomainOptions] = useState<string[]>([]);
  const [subdomainOptions, setSubdomainOptions] = useState<string[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [loadingSubdomains, setLoadingSubdomains] = useState(false);
  const [errorDomains, setErrorDomains] = useState<string | null>(null);
  const [errorSubdomains, setErrorSubdomains] = useState<string | null>(null);

  // Sync internal state with external filters prop
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Fetch domains on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      setLoadingDomains(true);
      setErrorDomains(null); // Clear previous errors
      try {
        const res = await api.get('/domains');
        // Assuming your API returns an array of objects with a 'domain' property
        setDomainOptions(res.data.domains?.map((d: any) => d.domain) || []);
      } catch (error) {
        console.error('Failed to fetch domains:', error);
        setErrorDomains('Failed to load domains. Please try again.');
      } finally {
        setLoadingDomains(false);
      }
    };
    fetchDomains();
  }, []);

  // Fetch subdomains when the selected domain changes
  useEffect(() => {
    const fetchSubdomains = async () => {
      // Clear subdomains and errors if domain is reset or not selected
      if (!localFilters.domain) {
        setSubdomainOptions([]);
        setErrorSubdomains(null);
        return;
      }

      setLoadingSubdomains(true);
      setErrorSubdomains(null); // Clear previous errors
      try {
        const res = await api.get('/subdomains', {
          params: { domain: localFilters.domain },
        });
        // Assuming your API returns an array of strings directly for subdomains
        setSubdomainOptions(res.data.subdomains || []);
      } catch (error) {
        console.error('Failed to fetch subdomains:', error);
        setErrorSubdomains('Failed to load subdomains. Please try again.');
        setSubdomainOptions([]); // Clear options on error
      } finally {
        setLoadingSubdomains(false);
      }
    };
    fetchSubdomains();
  }, [localFilters.domain]);

  // Handle changes to filter inputs and propagate to parent
  const handleChange = useCallback(
    (field: keyof typeof localFilters, value: string) => {
      const updatedFilters = {
        ...localFilters,
        [field]: value,
        // Reset subdomain if domain changes
        ...(field === 'domain' ? { subdomain: '' } : {}),
      };
      setLocalFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [localFilters, onFilterChange]
  );

  // --- Tailwind CSS Classes for Professional Styling ---

  // Base styles for all input and select elements
  const inputAndSelectClasses = `
    block w-full rounded-md border border-gray-300 bg-white
    px-4 py-2 text-base text-gray-900 placeholder-gray-500
    focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600
    transition-all duration-200 ease-in-out shadow-sm
  `;

  // Styles for labels - CHANGED TO text-white
  const labelClasses = 'block text-sm font-semibold text-white mb-1.5';

  // Styles for error messages
  const errorTextClasses = 'text-red-500 text-xs mt-1.5 font-medium'; // Changed to red-500 for better visibility on dark

  // Styles for informational messages (e.g., no subdomains)
  const infoTextClasses = 'text-gray-400 text-xs mt-1.5'; // Adjusted for better visibility on dark

  // Styles for disabled inputs/selects
  const disabledClasses = `
    opacity-70 cursor-not-allowed bg-gray-50 text-gray-500
  `;

  return (
    <section
      aria-label="Topic filtering options"
      className="bg-gray-900 p-6 rounded-lg shadow-2xl max-w-7xl mx-auto border border-gray-800"
    >
      <h2 className="sr-only">Topic Filtering Options</h2> {/* Screen reader only title */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showTitle && (
          <div>
            <label htmlFor="title-filter" className={labelClasses}>
              Topic Title
            </label>
            <input
              id="title-filter"
              type="text"
              placeholder="e.g., Introduction to Algebra"
              value={localFilters.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={inputAndSelectClasses}
            />
          </div>
        )}

        {showSubject && (
          <div>
            <label htmlFor="subject-filter" className={labelClasses}>
              Subject Name
            </label>
            <input
              id="subject-filter"
              type="text"
              placeholder="e.g., Mathematics"
              value={localFilters.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className={inputAndSelectClasses}
            />
          </div>
        )}

        {showStatus && (
          <div>
            <label htmlFor="status-filter" className={labelClasses}>
              Status
            </label>
            <select
              id="status-filter"
              value={localFilters.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={inputAndSelectClasses}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="remarked">Remarked</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="domain-filter" className={labelClasses}>
            Domain
          </label>
          <select
            id="domain-filter"
            value={localFilters.domain}
            onChange={(e) => handleChange('domain', e.target.value)}
            className={`${inputAndSelectClasses} ${loadingDomains || errorDomains ? disabledClasses : ''}`}
            disabled={loadingDomains || !!errorDomains}
          >
            <option value="">
              {loadingDomains ? 'Loading domains...' : 'Select a domain'}
            </option>
            {domainOptions.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          {errorDomains && <p className={errorTextClasses}>{errorDomains}</p>}
        </div>

        {/* Only show subdomain if a domain is selected */}
        {localFilters.domain && (
          <div>
            <label htmlFor="subdomain-filter" className={labelClasses}>
              Subdomain
            </label>
            <select
              id="subdomain-filter"
              value={localFilters.subdomain}
              onChange={(e) => handleChange('subdomain', e.target.value)}
              className={`${inputAndSelectClasses} ${loadingSubdomains || errorSubdomains || subdomainOptions.length === 0 ? disabledClasses : ''}`}
              disabled={loadingSubdomains || !!errorSubdomains || subdomainOptions.length === 0}
            >
              <option value="">
                {loadingSubdomains
                  ? 'Loading subdomains...'
                  : subdomainOptions.length === 0 && !errorSubdomains
                    ? 'No subdomains available'
                    : 'Select a subdomain'}
              </option>
              {subdomainOptions.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errorSubdomains && <p className={errorTextClasses}>{errorSubdomains}</p>}
            {localFilters.domain && !loadingSubdomains && subdomainOptions.length === 0 && !errorSubdomains && (
              <p className={infoTextClasses}>No subdomains found for this domain.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopicFilter;