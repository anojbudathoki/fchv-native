import NepaliDate from "nepali-date-converter";

/**
 * Returns the current Nepali month and year in format "Month Year" or "Year-Month"
 * For health reporting in Nepal, months are 1-indexed (Baisakh=1, etc.)
 */
export const getCurrentNepaliMonth = (): string => {
    const now = new NepaliDate();
    const year = now.getYear();
    const month = now.getMonth() + 1; // getMonth() is 0-indexed

    // Return format could be "YYYY-MM" for easy sorting/filtering
    return `${year}-${month.toString().padStart(2, '0')}`;
};

export const NepaliMonthNames = [
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

export const getNepaliMonthName = (monthIndex: number): string => {
    return NepaliMonthNames[monthIndex - 1] || "";
};
