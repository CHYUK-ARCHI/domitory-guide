export interface ReferenceItem {
  category: string;
  name: string;
  area: number;
}

// Based on the provided image (inferred values, user should update these)
export const REFERENCE_DATA: ReferenceItem[] = [
  // 개인생활공간
  { category: '주거생활공간', name: '일반 사생실', area: 6000 }, // Example value
  
  // 필수생활지원공간
  { category: '생활편의공간', name: '층별 미니주방', area: 800 }, // Combined estimate
  { category: '생활편의공간', name: '택배보관실', area: 850 },
  { category: '생활편의공간', name: '프린터실', area: 0 }, // Part of above or separate
  { category: '생활편의공간', name: '기도실', area: 0 },
  { category: '생활편의공간', name: '휴게라운지', area: 450 },
  { category: '생활편의공간', name: '체력단련실', area: 0 }, // Part of above or separate
  { category: '생활편의공간', name: '공동세탁실', area: 0 },

  // 특화커뮤니티공간
  { category: '특화커뮤니티공간', name: '특화프로그램 제안1', area: 400 },

  // 관리행정공간
  { category: '관리공간', name: '관리사무실', area: 250 },

  // 공용공간
  { category: '공용공간', name: 'E/V홀, 화장실, 계단실 등', area: 3900 },
  { category: '공용공간', name: '기계·전기실 등', area: 600 },
];
