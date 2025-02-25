'use client';

import React, { useState, useEffect } from 'react';
import { FaChartPie, FaClipboardList, FaCodeBranch, FaChartLine } from 'react-icons/fa';
import { BsPeopleFill, BsGlobe2 } from 'react-icons/bs';
import { MdSpeed, MdAttachMoney, MdScale, MdVerifiedUser } from 'react-icons/md';
import OverviewTab from './tabs/OverviewTab';
import CriteriaTab from './tabs/CriteriaTab';
import MethodTab from './tabs/MethodTab';
import RadarTab from './tabs/RadarTab';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CriteriaName, MethodName, MAUTData } from './types';

// Default data from data.md
const DEFAULT_DATA: MAUTData = {
  baseline: {
    criteria: ['Team size', 'Team distribution', 'Development Speed', 'Cost Management', 'Scalability', 'Quality Assurance'],
    methods: ['Scrum', 'XP', 'Kanban', 'Scrumban', 'Our Method'],
    values: {
      'Scrum': [5, 2, 5, 3, 3, 4],
      'XP': [4, 2, 5, 3, 2, 5],
      'Kanban': [3, 5, 4, 5, 4, 3],
      'Scrumban': [4, 4, 5, 4, 4, 4],
      'Our Method': [4, 5, 5, 4, 5, 5]
    }
  },
  weights: {
    'Team size': 0.15,
    'Team distribution': 0.20,
    'Development Speed': 0.20,
    'Cost Management': 0.15,
    'Scalability': 0.15,
    'Quality Assurance': 0.15
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
    factsAndAssumptions: {
      'Team size': {
        facts: "Fact: The NDSS / SALL-E team consists of fewer than 15 people (PRD specifies 8 in San Jose, 3 in Tampa). The team is cross-functional (developers, product managers, engineering managers). Assumption: Since the team is small, lightweight methodologies (e.g., Scrum, Kanban) are preferred.",
        scaleInterpretation: {
          1: "Large team (50+ members), Requires complex governance",
          2: "Medium-sized team (30–50 members), Needs structured processes",
          3: "Small team (15–30 members), Can balance Agile with structure",
          4: "Lean team (<15 members), Prefers lightweight methodologies",
          5: "Very small team (<10 members), Agile & fast iterations are ideal"
        }
      },
      'Team distribution': {
        facts: "Fact: Team is distributed globally across San Jose & Tampa. Assumption: Asynchronous communication and strong collaboration tools (Slack, Jira) are required.",
        scaleInterpretation: {
          1: "Fully co-located team in one office",
          2: "Mostly co-located with some remote members",
          3: "Hybrid team (partially remote)",
          4: "Majority distributed across different locations",
          5: "Fully distributed across multiple time zones"
        }
      },
      'Development Speed': {
        facts: "Fact: The time to launch is a success metric, requiring fast iterations. Assumption: CI/CD pipelines and automated testing are essential for rapid delivery.",
        scaleInterpretation: {
          1: "Long-term development (>1 year)",
          2: "Medium-speed project, no urgent deadlines",
          3: "Balanced speed vs. quality",
          4: "Rapid development required",
          5: "Extreme speed (MVP in weeks, continuous deployment)"
        }
      },
      'Cost Management': {
        facts: "Fact: NDSS wants to control costs while ensuring quality. Assumption: Lean principles should minimize waste and optimize spending.",
        scaleInterpretation: {
          1: "Unlimited budget, cost is not a concern",
          2: "High budget, but cost-conscious",
          3: "Moderate budget, needs cost optimization",
          4: "Tight budget, needs efficiency",
          5: "Very limited budget, requires strict cost control"
        }
      },
      'Scalability': {
        facts: "Fact: PRD states SALL-E will expand to support more users and clients over time. Assumption: The system must be modular and cloud-based for growth.",
        scaleInterpretation: {
          1: "Small, single-use application",
          2: "Some scalability but not a priority",
          3: "Needs moderate scalability",
          4: "Needs strong scalability",
          5: "High growth expected, must scale rapidly"
        }
      },
      'Quality Assurance': {
        facts: "Fact: The PRD emphasizes ensuring reliability and minimizing downtime. Assumption: TDD, automated testing, and peer code reviews will be needed.",
        scaleInterpretation: {
          1: "Low emphasis on quality, testing not a priority",
          2: "Minimal QA, only functional testing",
          3: "Moderate QA, some automation and code reviews",
          4: "Strong QA, TDD, automated testing, code reviews",
          5: "Very high quality standards, rigorous testing required"
        }
      }
    }
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

// Color palette for criteria categories
export const CRITERIA_COLORS: { [key in CriteriaName]: { light: string; medium: string; dark: string; } } = {
  "Team size": { light: "#E1F5FE", medium: "#81D4FA", dark: "#0288D1" },         // Blue
  "Team distribution": { light: "#F3E5F5", medium: "#CE93D8", dark: "#7B1FA2" }, // Purple
  "Development Speed": { light: "#FFF8E1", medium: "#FFD54F", dark: "#FFA000" }, // Amber/Gold
  "Cost Management": { light: "#E8EAF6", medium: "#7986CB", dark: "#3949AB" },   // Indigo
  "Scalability": { light: "#FFF3E0", medium: "#FFA726", dark: "#F57C00" },       // Orange
  "Quality Assurance": { light: "#E8F5E9", medium: "#66BB6A", dark: "#2E7D32" }  // Green
};

// Add icon mapping before the MAUTDashboard component
const CRITERIA_ICONS: { [key in CriteriaName]: React.ReactElement } = {
  "Team size": <BsPeopleFill className="inline-block mr-2" />,
  "Team distribution": <BsGlobe2 className="inline-block mr-2" />,
  "Development Speed": <MdSpeed className="inline-block mr-2" />,
  "Cost Management": <MdAttachMoney className="inline-block mr-2" />,
  "Scalability": <MdScale className="inline-block mr-2" />,
  "Quality Assurance": <MdVerifiedUser className="inline-block mr-2" />
};

// Add a Tooltip wrapper component for reusability
const TooltipWrapper = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div className="inline-flex items-center cursor-pointer">
          {children}
        </div>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm"
          sideOffset={5}
        >
          {content}
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

// Add this helper function to get tooltip content for criteria
const getCriteriaTooltip = (criteria: CriteriaName): string => {
  return `Click to visualize ${criteria.toLowerCase()} analysis`;
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
        <TooltipWrapper content="Overview of all criteria and methods">
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartPie className="mr-2" />
            Overview
          </button>
        </TooltipWrapper>
        
        <TooltipWrapper content="Detailed analysis of individual criteria">
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'criteria' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('criteria')}
          >
            <FaClipboardList className="mr-2" />
            Criteria Analysis
          </button>
        </TooltipWrapper>
        
        <TooltipWrapper content="Analysis of individual methods">
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'method' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('method')}
          >
            <FaCodeBranch className="mr-2" />
            Method Analysis
          </button>
        </TooltipWrapper>
        
        <TooltipWrapper content="Compare methods using radar charts">
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'radar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('radar')}
          >
            <FaChartLine className="mr-2" />
            Radar Comparison
          </button>
        </TooltipWrapper>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          data={data}
          handleMethodSelect={handleMethodSelect}
          handleCriteriaSelect={handleCriteriaSelect}
          onValueChange={handleValueChange}
          onWeightChange={handleWeightChange}
          criteriaIcons={CRITERIA_ICONS}
          TooltipWrapper={TooltipWrapper}
          getCriteriaTooltip={getCriteriaTooltip}
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
          criteriaIcons={CRITERIA_ICONS}
          TooltipWrapper={TooltipWrapper}
          getCriteriaTooltip={getCriteriaTooltip}
        />
      )}
      
      {activeTab === 'method' && selectedMethod && (
        <MethodTab
          data={data}
          selectedMethod={selectedMethod}
          handleMethodSelect={handleMethodSelect}
          handleCriteriaSelect={handleCriteriaSelect}
          onValueChange={handleValueChange}
          criteriaIcons={CRITERIA_ICONS}
          TooltipWrapper={TooltipWrapper}
          getCriteriaTooltip={getCriteriaTooltip}
        />
      )}
      
      {activeTab === 'radar' && (
        <RadarTab 
          data={data}
          criteriaIcons={CRITERIA_ICONS}
        />
      )}
    </div>
  );
};

export default MAUTDashboard; 