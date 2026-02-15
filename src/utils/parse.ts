const safeParse = <T>(value: string): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    // fallback for plain string values
    return value as unknown as T;
  }
};

export default safeParse;
