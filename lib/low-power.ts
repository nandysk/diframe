// Devices that ask for less: data saver on, or very little processing power or memory.
// Animated canvases draw a single still frame there.
export function isLowPower() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return (
    nav.connection?.saveData === true ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)
  );
}
