export type CalculationMode = 'Recommended' | 'Basic';

export interface CalculationResult {
  mode: CalculationMode;
  residents: number;
  spaces: {
    category: string;
    name: string;
    units: number;
    area: number;
    formula?: string;
  }[];
  netArea: number;
  sharedArea: number;
  grossArea: number;
  areaPerPerson: number;
}

const MODULES = {
  M13_2: 13.2,
  M26_4: 26.4,
  M39_6: 39.6,
  M66_0: 66.0,
  M92_4: 92.4,
  M105_6: 105.6,
};

// Fixed spaces that don't depend on residents (beyond base existence)
const FIXED_SPACES = [
  { category: '생활편의공간', name: '편의점', area: MODULES.M92_4, units: 1 },
  { category: '관리공간', name: '행정라운지', area: MODULES.M105_6, units: 1 },
  { category: '관리공간', name: '경비실', area: MODULES.M13_2, units: 1 },
  { category: '관리공간', name: '당직실', area: MODULES.M13_2, units: 1 },
  { category: '관리공간', name: '근로자휴게실', area: MODULES.M13_2, units: 1 },
  { category: '관리공간', name: '사감실(남)', area: MODULES.M26_4, units: 1 },
  { category: '관리공간', name: '사감실(여)', area: MODULES.M26_4, units: 1 },
];

export function calculateArea(residents: number, mode: CalculationMode): CalculationResult {
  const isRecommended = mode === 'Recommended';
  
  // Shared Area Ratio
  const sharedRatio = isRecommended ? 0.35 : 0.29;
  
  // Dynamic Spaces
  const dynamicSpaces = [];
  
  // 1. General Rooms
  const roomUnits = residents / 2; // Assuming 2 person per room? Explicitly residents/2
  // Note: If odd number of residents, ceil? Excel example 100->50 rooms. 
  // Let's assume input is even or allowed to be fractional units? Excel usually implies capacity.
  // Actually residents/2 is "Units Formula" denominator is 2. 
  // If residents=101? 50.5 rooms? 
  // For safety, let's use residents/2 exactly as area calc, or ceil(residents/2) for physical rooms?
  // Excel CalcType PER_ROOM. Units Formula = Residents / 2.
  // We'll stick to simple division for now as per Excel numbers (100 -> 50, 400 -> 200).
  dynamicSpaces.push({
    category: '주거생활공간',
    name: '일반 사생실',
    units: roomUnits,
    area: roomUnits * MODULES.M26_4
  });

  // 2. Study Lounge
  const studyDivisor = isRecommended ? 20 : 40;
  const studyUnits = Math.ceil(residents / studyDivisor);
  dynamicSpaces.push({
    category: '학습지원공간',
    name: '스터디라운지',
    units: studyUnits,
    area: studyUnits * MODULES.M39_6
  });
  
  // 3. Gym
  const gymUnits = Math.ceil(residents / 330);
  dynamicSpaces.push({
    category: '생활편의공간',
    name: '체력단련실',
    units: gymUnits,
    area: gymUnits * MODULES.M66_0
  });

  // 4. Kitchen
  const kitchenUnits = Math.ceil(residents / 180);
  dynamicSpaces.push({
    category: '생활편의공간',
    name: '공유주방',
    units: kitchenUnits,
    area: kitchenUnits * MODULES.M26_4
  });

  // 5. Laundry
  const laundryUnits = Math.ceil(residents / 300);
  dynamicSpaces.push({
    category: '생활편의공간',
    name: '공동세탁실',
    units: laundryUnits,
    area: laundryUnits * MODULES.M39_6
  });

  // 6. Storage
  const storageUnits = Math.ceil(residents / 150);
  dynamicSpaces.push({
    category: '생활편의공간',
    name: '짐·택배 통합보관실',
    units: storageUnits,
    area: storageUnits * MODULES.M26_4
  });

  // Combine All Spaces
  const allSpaces = [...dynamicSpaces, ...FIXED_SPACES];
  
  // Calculate Net Area
  const netArea = allSpaces.reduce((sum, space) => sum + space.area, 0);
  
  // Calculate Gross Area
  // Gross = Net / (1 - Ratio)
  const grossArea = netArea / (1 - sharedRatio);
  
  const sharedArea = grossArea - netArea;
  
  return {
    mode,
    residents,
    spaces: allSpaces,
    netArea,
    sharedArea,
    grossArea,
    areaPerPerson: grossArea / residents
  };
}
