'use client';

import React, { useState, useEffect } from 'react';
import OverviewTab from './tabs/OverviewTab';
import CriteriaTab from './tabs/CriteriaTab';
import MethodTab from './tabs/MethodTab';
import RadarTab from './tabs/RadarTab';

type MethodName = 'Scrum' | 'XP' | 'Kanban' | 'Scrumban' | 'Our Method';
type CriteriaName = 'Team size' | 'Team distribution' | 'Application Criticality' | 'Requirement Volatility' |
                    'Development Speed' | 'Cost Management' | 'Scalability' | 'Quality Assurance' | 'Workflow Efficiency';

interface MAUTData {
  baseline: {
    criteria: CriteriaName[];
    methods: MethodName[];
    values: {
      [key in MethodName]: number[];
    };
  };
  weights: {
    [key in CriteriaName]: number;
  };
  nonEditableContent: {
    process: Array<{
      step: string;
      description: string;
    }>;
    factsAndAssumptions: Record<string, unknown>;
  };
}

// Default data from data.md
const DEFAULT_DATA: MAUTData = {
  baseline: {
    criteria: ['Team size', 'Team distribution', 'Application Criticality', 'Requirement Volatility', 
               'Development Speed', 'Cost Management', 'Scalability', 'Quality Assurance', 'Workflow Efficiency'],
    methods: ['Scrum', 'XP', 'Kanban', 'Scrumban', 'Our Method'],
    values: {
      'Scrum': [5, 2, 2, 4, 5, 3, 3, 4, 4],
      'XP': [4, 2, 2, 5, 5, 3, 2, 5, 4],
      'Kanban': [3, 5, 3, 5, 4, 5, 4, 3, 5],
      'Scrumban': [4, 4, 3, 5, 5, 4, 4, 4, 5],
      'Our Method': [4, 5, 4, 5, 5, 4, 5, 5, 5]
    }
  },
  weights: {
    'Team size': 0.1,
    'Team distribution': 0.15,
    'Application Criticality': 0.05,
    'Requirement Volatility': 0.2,
    'Development Speed': 0.12,
    'Cost Management': 0.08,
    'Scalability': 0.1,
    'Quality Assurance': 0.07,
    'Workflow Efficiency': 0.13
  },
  nonEditableContent: {
    process: [
      { step: 'Focus on Method Over Practices', description: "Rather than evaluating individual practices, we focused on entire methods to determine which approach best aligned with SALL-E's needs." },
      { step: 'Identify Key Criteria', description: "We first determined which criteria were most relevant to the SALL-E project by evaluating their impact on the method selection." },
      { step: 'Define Facts & Assumptions', description: "For each criteria, we documented facts and assumptions specific to SALL-E to ensure our evaluation was grounded in project constraints." },
      { step: 'Assign Weights', description: "We applied weights to each criterion based on its importance to SALL-E, ensuring the most critical factors had greater influence." },
      { step: 'Score Methodologies', description: "Each team member independently voted on how each method would score relative to the predefined scale." },
      { step: 'Apply Weighted Scores', description: "We multiplied the baseline values by assigned weights to calculate overall scores for objective comparison." }
    ],
    factsAndAssumptions: {}
  }
};

// Color palette for the methods
export const COLORS: { [key in MethodName]: string } = {
  "Scrum": "#0088FE",
  "XP": "#00C49F",
  "Kanban": "#FFBB28",
  "Scrumban": "#FF8042",
  "Our Method": "#8884D8"
};

const MAUTDashboard = () => {
  const [data, setData] = useState<MAUTData | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCriteria, setSelectedCriteria] = useState<CriteriaName | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MethodName | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Initialize with default data
    setData(DEFAULT_DATA);
    setSelectedCriteria(DEFAULT_DATA.baseline.criteria[0]);
    setSelectedMethod(DEFAULT_DATA.baseline.methods[0]);
    setLoading(false);
  }, []);

  const handleValueChange = (method: MethodName, criteria: CriteriaName, newValue: number) => {
    if (!data) return;
    
    setData(prevData => {
      if (!prevData) return prevData;
      
      const criteriaIndex = prevData.baseline.criteria.indexOf(criteria);
      const newValues = [...prevData.baseline.values[method]];
      newValues[criteriaIndex] = newValue;
      
      return {
        ...prevData,
        baseline: {
          ...prevData.baseline,
          values: {
            ...prevData.baseline.values,
            [method]: newValues
          }
        }
      };
    });
    setHasChanges(true);
  };

  const handleWeightChange = (criteria: CriteriaName, newWeight: number) => {
    if (!data) return;
    
    setData(prevData => {
      if (!prevData) return prevData;
      
      return {
        ...prevData,
        weights: {
          ...prevData.weights,
          [criteria]: newWeight
        }
      };
    });
    setHasChanges(true);
  };

  const resetToDefault = () => {
    setData(DEFAULT_DATA);
    setHasChanges(false);
  };

  const handleCriteriaSelect = (criteria: CriteriaName) => {
    setSelectedCriteria(criteria);
    setActiveTab('criteria');
  };

  const handleMethodSelect = (method: MethodName) => {
    setSelectedMethod(method);
    setActiveTab('method');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl font-semibold">Loading MAUT analysis data...</div>
        <div className="mt-4">Please wait while we process the files</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-800 rounded-lg">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">MAUT Decision Making Analysis</h1>
        {hasChanges && (
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Reset to Default Values
          </button>
        )}
      </div>
      
      {/* Dashboard Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === 'criteria' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('criteria')}
        >
          Criteria Analysis
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === 'method' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('method')}
        >
          Method Analysis
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${activeTab === 'radar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('radar')}
        >
          Radar Comparison
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          data={data}
          handleMethodSelect={handleMethodSelect}
          handleCriteriaSelect={handleCriteriaSelect}
          onValueChange={handleValueChange}
          onWeightChange={handleWeightChange}
        />
      )}
      
      {activeTab === 'criteria' && selectedCriteria && (
        <CriteriaTab
          data={data}
          selectedCriteria={selectedCriteria}
          handleCriteriaSelect={handleCriteriaSelect}
          handleMethodSelect={handleMethodSelect}
          onValueChange={handleValueChange}
          onWeightChange={handleWeightChange}
        />
      )}
      
      {activeTab === 'method' && selectedMethod && (
        <MethodTab
          data={data}
          selectedMethod={selectedMethod}
          handleMethodSelect={handleMethodSelect}
          handleCriteriaSelect={handleCriteriaSelect}
          onValueChange={handleValueChange}
        />
      )}
      
      {activeTab === 'radar' && (
        <RadarTab data={data} />
      )}
    </div>
  );
};

export default MAUTDashboard; 