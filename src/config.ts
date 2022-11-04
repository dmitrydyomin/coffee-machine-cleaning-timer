export const config = {
  time: {
    work: 5000,
    rest: 10000,
    refreshInterval: 50,
    cycleCompleteThreshold: 0.6,
  },
  colors: {
    work: 'red',
    workBlank: '#ccc',
    rest: 'lime',
    restBlank: '#eee',
  },
  storage: {
    cyclesThreshold: 10,
    localStorageKey: 'coffee-days-cycles',
    recentDates: 5,
  },
  svg: {
    size: 100,
    offset: 50,
    lineWidth: 4,
    radius: 25,
  },
};
