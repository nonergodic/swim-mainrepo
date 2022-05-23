import type { TokenSpec } from "../../config";
import { useConfig } from "../../contexts";
import { getRequiredTokens, getTokensByPool } from "../../models";

import { useInteraction } from "./useInteraction";
import { useRequiredPoolsForInteraction } from "./useRequiredPoolsForInteraction";

export const useRequiredTokensForInteraction = (
  interactionId: string,
): readonly TokenSpec[] => {
  const config = useConfig();
  const tokensByPoolId = getTokensByPool(config);
  const interaction = useInteraction(interactionId);
  const pools = useRequiredPoolsForInteraction(interactionId);
  return getRequiredTokens(tokensByPoolId, pools, interaction);
};