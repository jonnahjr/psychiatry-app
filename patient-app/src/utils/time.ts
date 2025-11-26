// Ethiopian Timezone Utilities
// Ethiopia is UTC+3 and doesn't observe DST

export const getEthiopianTime = (): Date => {
  // Get current UTC time
  const now = new Date();

  // Convert to Ethiopian time (UTC+3)
  const ethiopianTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));

  return ethiopianTime;
};

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const ethiopianTime = getEthiopianTime();
  const hour = ethiopianTime.getUTCHours();

  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};

export const getGreeting = (): string => {
  const timeOfDay = getTimeOfDay();

  switch (timeOfDay) {
    case 'morning':
      return 'Good morning';
    case 'afternoon':
      return 'Good afternoon';
    case 'evening':
      return 'Good evening';
    default:
      return 'Hello';
  }
};

export const getCurrentEthiopianTimeString = (): string => {
  const ethiopianTime = getEthiopianTime();
  return ethiopianTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC' // Since we're already converted to Ethiopian time
  });
};