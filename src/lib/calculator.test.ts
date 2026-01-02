import { describe, it, expect } from 'vitest';
import { calculateArea } from './calculator';

describe('Dormitory Area Calculator', () => {
  it('calculates correctly for 100 residents (Recommended)', () => {
    const result = calculateArea(100, 'Recommended');
    
    // Check key components
    const rooms = result.spaces.find(s => s.name === '일반 사생실');
    expect(rooms?.area).toBe(1320);
    
    const lounge = result.spaces.find(s => s.name === '스터디라운지');
    expect(lounge?.area).toBe(198); // 100/20 = 5 units * 39.6 = 198
    
    const gym = result.spaces.find(s => s.name === '체력단련실');
    expect(gym?.area).toBe(66); // 100/330 = 0.3 -> 1 unit * 66 = 66
    
    // Check Totals
    expect(result.netArea).toBeCloseTo(1966.8, 1);
    expect(result.grossArea).toBeCloseTo(3025.85, 1);
  });

  it('calculates correctly for 700 residents (Recommended)', () => {
    const result = calculateArea(700, 'Recommended');
    
    const rooms = result.spaces.find(s => s.name === '일반 사생실');
    expect(rooms?.area).toBe(9240); // 350 * 26.4
    
    expect(result.netArea).toBeCloseTo(11470.8, 1);
  });
  
  it('calculates correctly for Basic Mode (100 residents)', () => {
    const result = calculateArea(100, 'Basic');
    
    // Study Lounge Divisor 40 -> 100/40 = 2.5 -> 3 units * 39.6 = 118.8
    const lounge = result.spaces.find(s => s.name === '스터디라운지');
    expect(lounge?.area).toBeCloseTo(118.8, 1);
    
    // Gross Area uses 29% ratio
    // Net should be different due to Lounge difference
    // Net: 1966.8 (Rec) - (198 - 118.8) = 1887.6
    expect(result.netArea).toBeCloseTo(1887.6, 1);
    
    const expectedGross = 1887.6 / (1 - 0.29);
    expect(result.grossArea).toBeCloseTo(expectedGross, 1);
  });
});
