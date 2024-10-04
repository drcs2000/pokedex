const weightRanges = [
  { min: 0, max: 10, label: "0kg to 10kg" },
  { min: 10, max: 24, label: "10kg to 24kg" },
  { min: 24, max: 45, label: "24kg to 45kg" },
  { min: 45, max: 100, label: "45kg to 100kg" },
  { min: 100, max: null, label: "+100kg" }
];

function getWeightLabel(min: number, max: number): string {
  return `${min}kg to ${max}kg`;
}

function getWeightRanges() {
  return weightRanges.map(range => range.label);
}

function getWeightValues(label: string) {
  const range = weightRanges.find(range => range.label === label);
  return range ? { min: range.min, max: range.max } : null;
}

export { getWeightRanges, getWeightValues };
