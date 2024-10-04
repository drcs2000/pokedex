const heightRanges = [
  { min: 0, max: 0.5, label: "0m to 0.5m" },
  { min: 0.5, max: 1, label: "0.5m to 1m" },
  { min: 1, max: 2, label: "1m to 2m" },
  { min: 2, max: 3, label: "2m to 3m" },
  { min: 3, max: null, label: "+3m" }
];

function getHeightLabel(min: number, max: number): string {
  return `${min}m to ${max}m`;
}

function getHeightRanges() {
  return heightRanges.map(range => range.label);
}

function getHeightValues(label: string) {
  const range = heightRanges.find(range => range.label === label);
  return range ? { min: range.min, max: range.max } : null;
}

export { getHeightRanges, getHeightValues };
