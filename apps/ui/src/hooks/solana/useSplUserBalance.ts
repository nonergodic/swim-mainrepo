import Decimal from "decimal.js";

import { useSolanaWallet } from "../../contexts";
import { findTokenAccountForMint } from "../../models";

import { useSplTokenAccountsQuery } from "./useSplTokenAccountsQuery";

export const useSplUserBalance = (
  mintAddress: string | null,
): Decimal | null => {
  const { address: walletAddress } = useSolanaWallet();
  const { data: splTokenAccounts = null } = useSplTokenAccountsQuery();
  const splTokenAccount =
    mintAddress !== null && walletAddress !== null && splTokenAccounts !== null
      ? findTokenAccountForMint(mintAddress, walletAddress, splTokenAccounts)
      : null;
  return splTokenAccount
    ? new Decimal(splTokenAccount.amount.toString())
    : null;
};