export function parseJsonField(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    if (typeof value === "string" && value.trim()) {
      return value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }
    return fallback;
  }
}

export function stringifyJsonField(value, fallback = "[]") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string") {
    try {
      JSON.parse(value);
      return value;
    } catch {
      return fallback;
    }
  }
  return JSON.stringify(value);
}

export const defaultFees = {
  amount: null,
  label: "Fee details available on enquiry",
  note: "Contact us for current offers, scholarships, and installment options.",
};
