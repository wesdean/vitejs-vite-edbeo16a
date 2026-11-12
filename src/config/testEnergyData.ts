import type { EnergyLogEntry } from './appConfig';

export const mockTestEnergyLogs: EnergyLogEntry[] = [
  {
    id: 'test-log-1',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    level: 80,
    tierLabel: 'Steady Focus',
    tags: ['Deep Work', 'Coffee'],
    note: 'Felt clear-headed and managed pacing well.'
  },
  {
    id: 'test-log-2',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    level: 45,
    tierLabel: 'Sensory Fatigue',
    tags: ['Meetings', 'Overload'],
    note: 'Back-to-back calls drained stamina quickly.'
  },
  {
    id: 'test-log-3',
    timestamp: new Date().toISOString(),
    level: 65,
    tierLabel: 'Moderate Energy',
    tags: ['Quiet Time', 'Walk'],
    note: 'Recovered balance with an afternoon stroll.'
  }
];