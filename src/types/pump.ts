export type PumpFeeBucket = {
  bucket: string;
  creatorFee?: string;
  creatorFeeSOL?: string;
  numTrades?: number;
  cumulativeCreatorFee?: string;
  cumulativeCreatorFeeSOL?: string;
};

export type PumpFeeResponse = PumpFeeBucket[];

export type PumpFeeTotal = {
  creatorFee?: string;
  creatorFeeSOL?: string;
  numTrades?: number;
};
