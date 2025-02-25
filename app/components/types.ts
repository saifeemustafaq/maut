export type MethodName = 'Scrum' | 'XP' | 'Kanban' | 'Scrumban' | 'Our Method';
export type CriteriaName = 'Team size' | 'Team distribution' | 'Development Speed' | 'Cost Management' | 'Scalability' | 'Quality Assurance';

export interface MAUTData {
  baseline: {
    criteria: CriteriaName[];
    methods: MethodName[];
    values: { [key in MethodName]: number[] };
  };
  weights: { [key in CriteriaName]: number };
  nonEditableContent: {
    process: Array<{
      step: string;
      description: string;
    }>;
    factsAndAssumptions: {
      [key in CriteriaName]: {
        facts: string;
        scaleInterpretation: {
          1: string;
          2: string;
          3: string;
          4: string;
          5: string;
        };
      };
    };
  };
} 