type TotalDebt = (debt: number, rate: number) => number;
export const totalDebt: TotalDebt = (debt, rate) => debt * rate;
