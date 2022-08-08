import { EuiCallOut, EuiLoadingSpinner, EuiSpacer } from "@elastic/eui";
import type Decimal from "decimal.js";
import type { FC } from "react";
import shallow from "zustand/shallow.js";

import { decimalRemoveTrailingZero } from "../amounts";
import type { EcosystemId } from "../config";
import { ECOSYSTEM_IDS } from "../config";
import { selectConfig } from "../core/selectors";
import { useEnvironment } from "../core/store";
import type { FeesEstimation } from "../models";

interface Props {
  readonly feesEstimation: Partial<FeesEstimation> | null;
}

export const EstimatedTxFeesCallout: FC<Props> = ({ feesEstimation }) => {
  const config = useEnvironment(selectConfig, shallow);
  if (feesEstimation === null) {
    return (
      <>
        <EuiCallOut iconType="visGauge" size="s" style={{ paddingLeft: 12 }}>
          <EuiLoadingSpinner size="m" />
          <span className="euiCallOutHeader__title" style={{ marginLeft: 8 }}>
            Estimating Transaction Fees...
          </span>
        </EuiCallOut>
        <EuiSpacer />
      </>
    );
  }
  const txFeeArray = ECOSYSTEM_IDS.map((ecosystemId) => {
    return {
      ecosystemId,
      txFee: feesEstimation[ecosystemId],
    };
  }).filter(
    (
      txFeeObj,
    ): txFeeObj is {
      readonly ecosystemId: EcosystemId;
      readonly txFee: Decimal;
    } => {
      return txFeeObj.txFee !== undefined && !txFeeObj.txFee.isZero();
    },
  );

  return (
    <>
      <EuiCallOut
        size="s"
        iconType="visGauge"
        title={`Estimated Transaction Fees`}
        style={{ paddingLeft: 12 }}
      >
        <ul>
          {txFeeArray.map(({ ecosystemId, txFee }) => {
            const { displayName, nativeTokenSymbol } =
              config.ecosystems[ecosystemId];
            return (
              <li key={ecosystemId}>
                {displayName}
                {": ~"}
                {decimalRemoveTrailingZero(txFee)} {nativeTokenSymbol}
              </li>
            );
          })}
        </ul>
      </EuiCallOut>
      <EuiSpacer />
    </>
  );
};
