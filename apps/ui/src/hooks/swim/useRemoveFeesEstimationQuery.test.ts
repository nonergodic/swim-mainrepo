import { renderHook } from "@testing-library/react-hooks";
import Decimal from "decimal.js";
import { useQueryClient } from "react-query";

import { EcosystemId } from "../../config";
import { AppContext } from "../../contexts";
import { Amount } from "../../models";
import { findLocalnetTokenById, mockOf } from "../../testUtils";

import { useGasPriceQuery } from "./useGasPriceQuery";
import { useRemoveFeesEstimationQuery } from "./useRemoveFeesEstimationQuery";

jest.mock("./useGasPriceQuery", () => ({
  useGasPriceQuery: jest.fn(),
}));

// Make typescript happy with jest
const useGasPriceQueryMock = mockOf(useGasPriceQuery);

const SOLANA_USDC = findLocalnetTokenById("localnet-solana-usdc");
const SOLANA_USDT = findLocalnetTokenById("localnet-solana-usdt");
const ETHEREUM_USDC = findLocalnetTokenById("localnet-ethereum-usdc");
const ETHEREUM_USDT = findLocalnetTokenById("localnet-ethereum-usdt");
const BSC_BUSD = findLocalnetTokenById("localnet-bsc-busd");
const BSC_USDT = findLocalnetTokenById("localnet-bsc-usdt");

describe("useRemoveFeesEstimationQuery", () => {
  beforeEach(() => {
    // Reset queryClient cache, otherwise test might return previous value
    // eslint-disable-next-line testing-library/no-render-in-setup
    renderHook(() => useQueryClient().clear(), {
      wrapper: AppContext,
    });
  });

  it("should return null when the gas price is still loading", async () => {
    useGasPriceQueryMock.mockReturnValue({ isLoading: true, data: undefined });
    const { result } = renderHook(
      () =>
        useRemoveFeesEstimationQuery(
          [
            Amount.fromHuman(SOLANA_USDC, new Decimal(99)),
            Amount.fromHuman(SOLANA_USDT, new Decimal(99)),
            Amount.fromHuman(ETHEREUM_USDC, new Decimal(0)),
            Amount.fromHuman(ETHEREUM_USDT, new Decimal(0)),
            Amount.fromHuman(BSC_BUSD, new Decimal(0)),
            Amount.fromHuman(BSC_USDT, new Decimal(0)),
          ],
          EcosystemId.Solana,
        ),
      {
        wrapper: AppContext,
      },
    );
    expect(result.current).toEqual(null);
  });

  describe("loaded", () => {
    beforeEach(() => {
      useGasPriceQueryMock.mockImplementation((ecosystemId: EcosystemId) =>
        ecosystemId === EcosystemId.Ethereum
          ? { data: new Decimal(7e-8) }
          : { data: new Decimal(5e-9) },
      );
    });

    it("should return solana estimation for Solana USDC single remove", async () => {
      const { result } = renderHook(
        () =>
          useRemoveFeesEstimationQuery(
            [
              Amount.fromHuman(SOLANA_USDC, new Decimal(99)),
              Amount.fromHuman(SOLANA_USDT, new Decimal(0)),
              Amount.fromHuman(ETHEREUM_USDC, new Decimal(0)),
              Amount.fromHuman(ETHEREUM_USDT, new Decimal(0)),
              Amount.fromHuman(BSC_BUSD, new Decimal(0)),
              Amount.fromHuman(BSC_USDT, new Decimal(0)),
            ],
            EcosystemId.Solana,
          ),
        {
          wrapper: AppContext,
        },
      );
      expect(result.current?.solana).toEqual(new Decimal(0.01));
      expect(result.current?.ethereum).toEqual(new Decimal(0));
      expect(result.current?.bsc).toEqual(new Decimal(0));
    });

    it("should return eth estimation for Ethereum USDC single remove", async () => {
      const { result } = renderHook(
        () =>
          useRemoveFeesEstimationQuery(
            [
              Amount.fromHuman(SOLANA_USDC, new Decimal(0)),
              Amount.fromHuman(SOLANA_USDT, new Decimal(0)),
              Amount.fromHuman(ETHEREUM_USDC, new Decimal(99)),
              Amount.fromHuman(ETHEREUM_USDT, new Decimal(0)),
              Amount.fromHuman(BSC_BUSD, new Decimal(0)),
              Amount.fromHuman(BSC_USDT, new Decimal(0)),
            ],
            EcosystemId.Ethereum,
          ),
        {
          wrapper: AppContext,
        },
      );
      expect(result.current?.solana).toEqual(new Decimal(0.01));
      expect(result.current?.ethereum).toEqual(new Decimal(0.0343));
      expect(result.current?.bsc).toEqual(new Decimal(0));
    });

    it("should return bsc estimation for Bsc single remove", async () => {
      const { result } = renderHook(
        () =>
          useRemoveFeesEstimationQuery(
            [
              Amount.fromHuman(SOLANA_USDC, new Decimal(0)),
              Amount.fromHuman(SOLANA_USDT, new Decimal(0)),
              Amount.fromHuman(ETHEREUM_USDC, new Decimal(0)),
              Amount.fromHuman(ETHEREUM_USDT, new Decimal(0)),
              Amount.fromHuman(BSC_BUSD, new Decimal(99)),
              Amount.fromHuman(BSC_USDT, new Decimal(0)),
            ],
            EcosystemId.Bsc,
          ),
        {
          wrapper: AppContext,
        },
      );
      expect(result.current?.solana).toEqual(new Decimal(0.01));
      expect(result.current?.ethereum).toEqual(new Decimal(0));
      expect(result.current?.bsc).toEqual(new Decimal(0.00245));
    });

    it("should return valid estimation for mixed input amounts", async () => {
      const { result } = renderHook(
        () =>
          useRemoveFeesEstimationQuery(
            [
              Amount.fromHuman(SOLANA_USDC, new Decimal(100)),
              Amount.fromHuman(SOLANA_USDT, new Decimal(100)),
              Amount.fromHuman(ETHEREUM_USDC, new Decimal(100)),
              Amount.fromHuman(ETHEREUM_USDT, new Decimal(100)),
              Amount.fromHuman(BSC_BUSD, new Decimal(100)),
              Amount.fromHuman(BSC_USDT, new Decimal(100)),
            ],
            EcosystemId.Bsc,
          ),
        {
          wrapper: AppContext,
        },
      );
      expect(result.current?.solana).toEqual(new Decimal(0.01));
      expect(result.current?.ethereum).toEqual(new Decimal(0.042));
      expect(result.current?.bsc).toEqual(new Decimal(0.00395));
    });
  });
});
