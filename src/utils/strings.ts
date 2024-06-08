export const formatAccount = (account: string) =>
  `${account.slice(0, 7)}...${account.slice(-4)}`;

export const formatBigNumbers = (num: number) => {
  const numberWithSuffix = {
    100000: {
      suffix: "K",
      divisor: 1000,
      precision: 1,
    },
    1000000: {
      suffix: "M",
      precision: 10,
      divisor: 1000000,
    },
  };

  let result = "";

  Object.keys(numberWithSuffix).forEach((size) => {
    const sizeData =
      numberWithSuffix[size as unknown as keyof typeof numberWithSuffix];
    if (num >= +size)
      // Round down - better to be safe with money!
      result = `${
        Math.floor((num / sizeData.divisor) * sizeData.precision) /
        sizeData.precision
      }${sizeData.suffix}`;
  });

  return result || num.toFixed(2);
};
