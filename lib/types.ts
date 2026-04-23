export type Grade = 'e' | 'E' | 'l' | 'L' | 'y' | 'Y' | 't' | 'T' | 's' | 'S' | 'n' | 'N' | 'i' | 'I';

export interface CoverData {
  company: string;
  name: string;
  grade: Grade | '';
  period: string;
}

export interface KpiNumRow {
  prev: string;
  target: string;
  actual: string;
  nextTarget: string;
}

export interface CompanyGoalData {
  revenue: KpiNumRow;
  operatingProfit: KpiNumRow;
  operatingMargin: KpiNumRow;
  grossProfit: KpiNumRow;
  strategicFocus: [string, string];
}

export interface DeptActionRow {
  content: string;
  expectedEffect: string;
  deadline: string;
}

export interface DeptKpiNumRow {
  label: string;
  prev: string;
  target: string;
  actual: string;
  nextTarget: string;
}

export interface DeptGoalData {
  strategicFocusRef: string;
  mission: string;
  kpi1: DeptKpiNumRow;
  kpi2: DeptKpiNumRow;
  kpi3: DeptKpiNumRow;
  actions: DeptActionRow[];
}

export interface CurrentStatusRow {
  label: string;
  value: string;
}

export interface SmartGoalRow {
  goal: string;
  targetValue: string;
  deadline: string;
  note: string;
}

export interface KpiContribRow {
  deptKpi: string;
  myPart: string;
}

export interface PersonalGoalData {
  currentStatus: CurrentStatusRow[];
  smartGoals: SmartGoalRow[];
  kpiContribs: KpiContribRow[];
}

export interface PromotionData {
  valueScore: string;
  tenurePoint: number;
  deptGrowthPoint: number;
  personalKpiPoint: number;
  supervisorPoint: number;
  mgmtPoint: number;
  nurturingPoint: number;
}

export interface BonusData {
  canAfford: number;
  hasProfit: number;
  futureProfit: number;
  deptKpiAchieved: number;
  personalKpiAchieved: number;
  supervisorEval: number;
  noSupervisor: boolean;
  valueEval: number;
  reproducibility: number;
  roleAchievement: number;
  difficulty: number;
  mgmtEval: number;
}

export type GradeExpectations = Partial<Record<Grade, string>>;

export interface FormData {
  cover: CoverData;
  company: CompanyGoalData;
  dept: DeptGoalData;
  personal: PersonalGoalData;
  promotion: PromotionData;
  bonus: BonusData;
  gradeExpectations: GradeExpectations;
}

export interface GradeEntry {
  key: Grade;
  salary: string;
}

export interface GradeTier {
  tier: string;
  tierName: string;
  grades: GradeEntry[];
}

export const GRADE_TABLE: GradeTier[] = [
  { tier: 'I', tierName: 'INDEPENDENT and IDEAL', grades: [
    { key: 'I', salary: '—' },
    { key: 'i', salary: '—' },
  ]},
  { tier: 'N', tierName: 'NO RULES and NEVER SAY NEVER', grades: [
    { key: 'N', salary: '1,110,000' },
    { key: 'n', salary: '1,000,000' },
  ]},
  { tier: 'S', tierName: 'STRATEGIC', grades: [
    { key: 'S', salary: '900,000' },
    { key: 's', salary: '800,000' },
  ]},
  { tier: 'T', tierName: 'TACTICAL', grades: [
    { key: 'T', salary: '700,000' },
    { key: 't', salary: '600,000' },
  ]},
  { tier: 'Y', tierName: 'YEARNING', grades: [
    { key: 'Y', salary: '550,000' },
    { key: 'y', salary: '500,000' },
  ]},
  { tier: 'L', tierName: 'LOYALTY', grades: [
    { key: 'L', salary: '450,000' },
    { key: 'l', salary: '400,000' },
  ]},
  { tier: 'E', tierName: 'ENTRY', grades: [
    { key: 'E', salary: '370,000' },
    { key: 'e', salary: '330,000' },
  ]},
];

const HIDDEN_GRADES: Grade[] = ['N', 'n'];

export const GRADE_OPTIONS: { value: Grade; label: string }[] = GRADE_TABLE.flatMap(tier =>
  tier.grades
    .filter(g => !HIDDEN_GRADES.includes(g.key))
    .map(g => ({
      value: g.key,
      label: g.salary === '—' ? g.key : `${g.key}  (${g.salary}円/月)`,
    }))
);

const emptyKpiNum = (): KpiNumRow => ({ prev: '', target: '', actual: '', nextTarget: '' });
const emptyDeptKpiNum = (): DeptKpiNumRow => ({ label: '', prev: '', target: '', actual: '', nextTarget: '' });

export function createDefaultFormData(): FormData {
  return {
    cover: { company: '', name: '', grade: '', period: '' },
    company: {
      revenue: emptyKpiNum(),
      operatingProfit: emptyKpiNum(),
      operatingMargin: emptyKpiNum(),
      grossProfit: emptyKpiNum(),
      strategicFocus: ['', ''],
    },
    dept: {
      strategicFocusRef: '',
      mission: '',
      kpi1: emptyDeptKpiNum(),
      kpi2: emptyDeptKpiNum(),
      kpi3: emptyDeptKpiNum(),
      actions: Array(4).fill(null).map(() => ({ content: '', expectedEffect: '', deadline: '' })),
    },
    personal: {
      currentStatus: [
        { label: '前回面談で指摘された課題', value: '' },
        { label: 'それを受けてこの半期どう行動したか', value: '' },
        { label: '今期の役割・期待（自己認識）', value: '' },
      ],
      smartGoals: Array(3).fill(null).map(() => ({ goal: '', targetValue: '', deadline: '', note: '' })),
      kpiContribs: Array(3).fill(null).map(() => ({ deptKpi: '', myPart: '' })),
    },
    promotion: {
      valueScore: '',
      tenurePoint: 0,
      deptGrowthPoint: 1,
      personalKpiPoint: 1,
      supervisorPoint: 1,
      mgmtPoint: 1,
      nurturingPoint: 1,
    },
    bonus: {
      canAfford: 0,
      hasProfit: 0,
      futureProfit: 0,
      deptKpiAchieved: 0,
      personalKpiAchieved: 0,
      supervisorEval: 0,
      noSupervisor: false,
      valueEval: 0,
      reproducibility: 0,
      roleAchievement: 0,
      difficulty: 0,
      mgmtEval: 0,
    },
    gradeExpectations: {},
  };
}
