// Updated conversion rate: 1 ETH = 333,333 KSH (as of July 2024)
// This rate should be updated regularly or fetched from an API for accuracy
const ETH_TO_KSH_RATE = 333333;
const KSH_TO_ETH_RATE = 1 / ETH_TO_KSH_RATE;

export const convertKshToEth = (ksh) => (parseFloat(ksh) * KSH_TO_ETH_RATE).toFixed(18);
export const convertEthToKsh = (eth) => (parseFloat(eth) * ETH_TO_KSH_RATE).toFixed(2);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ETH_TO_KSH_RATE,
  KSH_TO_ETH_RATE,
  convertKshToEth,
  convertEthToKsh,
};
