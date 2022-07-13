import { EuiButton, EuiSpacer } from "@elastic/eui";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import type { FC } from "react";
import { useEffect } from "react";
import { useMutation } from "react-query";

import { Env, useEnvironment } from "../../core/store";
import { MOCK_SINGLE_CHAIN_SOLANA_SWAP_INTERACTION_STATE_COMPLETED } from "../../fixtures/swim/interactionStateV2";
import { INTERACTION_MUTATION_KEY } from "../../hooks/interaction";
import { sleep } from "../../utils";

import { InteractionStateComponentV2 } from "./InteractionStateComponentV2";

// TODO eventually remove when tokens are available in mainnet?
const EnvSwitcher: FC<any> = ({ children }) => {
  const { env, setEnv, setCustomLocalnetIp } = useEnvironment();

  useEffect(() => {
    if (env !== Env.Devnet) {
      setCustomLocalnetIp("12.12.14.1");
      setEnv(Env.Devnet);
    }
  }, [env, setEnv, setCustomLocalnetIp]);

  if (env !== Env.Devnet) return <p>Please wait while we switch to Devnet</p>;

  return children;
};

const Meta: ComponentMeta<typeof InteractionStateComponentV2> = {
  component: InteractionStateComponentV2,
  decorators: [(story) => <EnvSwitcher>{story()}</EnvSwitcher>],
};
export default Meta;

const Template: ComponentStory<typeof InteractionStateComponentV2> = (args) => {
  const {
    interaction: { id },
  } = MOCK_SINGLE_CHAIN_SOLANA_SWAP_INTERACTION_STATE_COMPLETED;
  const { mutate } = useMutation(
    async (interactionId: string) => {
      await sleep(5000);
    },
    {
      mutationKey: INTERACTION_MUTATION_KEY,
    },
  );

  return (
    <>
      <InteractionStateComponentV2 {...args} />
      <EuiSpacer />
      <EuiButton size="s" onClick={() => mutate(id)}>
        Trigger Loading
      </EuiButton>
    </>
  );
};

export const SingleChainSolanaCompleted = Template.bind({});
SingleChainSolanaCompleted.args = {
  interactionState: MOCK_SINGLE_CHAIN_SOLANA_SWAP_INTERACTION_STATE_COMPLETED,
};
