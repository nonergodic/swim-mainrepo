import {
  EuiEmptyPrompt,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
} from "@elastic/eui";
import type { ReactElement } from "react";
import { selectConfig } from "../core/selectors";
import { useEnvironment } from "../core/store";

import { PoolPageInner } from "./PoolPage";

export interface StakePageProps {
  readonly poolId: string;
}

const StakePage = ({ poolId }: StakePageProps): ReactElement => {
  const { pools } = useEnvironment(selectConfig);
  const poolSpec = pools.find((pool) => pool.id === poolId) ?? null;
  return (
    <EuiPage className="stakePage" restrictWidth={800}>
      <EuiPageBody>
        <EuiPageContent verticalPosition="center">
          <EuiPageContentBody>
            {poolSpec ? (
              <PoolPageInner poolSpec={poolSpec} />
            ) : (
              <EuiEmptyPrompt
                iconType="alert"
                title={<h2>Pool not found</h2>}
                titleSize="xs"
                body="Try changing the network in the upper right corner."
              />
            )}
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};

export default StakePage;
