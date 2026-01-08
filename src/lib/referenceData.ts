export interface ReferenceItem {
  category: string;
  name: string;
  area: number;
}

// Based on the provided image (inferred values, user should update these)
export const REFERENCE_DATA: ReferenceItem[] = [
  // 개인생활공간
  { category: '주거생활공간', name: '일반 사생실', area: 6000 },
  
  // 필수생활지원공간 (800 Total for Kitchen/Study/Lobby)
  { category: '생활편의공간', name: '층별 미니주방', area: 400 },
  { category: '생활편의공간', name: '층별 스터디룸 및 휴게라운지', area: 200 },
  { category: '생활편의공간', name: '로비 및 라운지', area: 200 },
  
  // 택배/프린터/기도실 (850 Total)
  { category: '생활편의공간', name: '택배보관실', area: 850 },
  { category: '생활편의공간', name: '프린터실', area: 0 },
  { category: '생활편의공간', name: '기도실', area: 0 },
  
  // 지하층 권장 (450 Total)
  { category: '생활편의공간', name: '휴게라운지(지하)', area: 125 },
  { category: '생활편의공간', name: '체력단련실', area: 200 }, // User specified min 200
  { category: '생활편의공간', name: '공동세탁실 및 건조실', area: 125 },

  // 특화커뮤니티공간
  { category: '특화커뮤니티공간', name: '특화프로그램 제안1', area: 400 },

  // 관리행정공간 (250 Total)
  { category: '관리공간', name: '관리행정공간 (소계)', area: 250 },

  // 공용공간
  { category: '공용공간', name: 'E/V홀, 화장실, 계단실 등', area: 3900 },
  { category: '공용공간', name: '기계·전기실 등', area: 600 },
];
