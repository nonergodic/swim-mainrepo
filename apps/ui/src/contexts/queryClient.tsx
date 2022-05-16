import type { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "react-query";
// eslint-disable-next-line import/extensions
import { ReactQueryDevtools } from "react-query/devtools";

import { selectNotify } from "../core/selectors";
import { useNotificationStore } from "../core/store";
import { captureException } from "../errors";

export const QueryClientProvider = ({
  children,
}: {
  readonly children?: ReactNode;
}): ReactElement => {
  const sendNotification = useNotificationStore(selectNotify);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchInterval: false,
            refetchIntervalInBackground: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: true,
            onError: (err) => {
              sendNotification("Network request error", String(err), "error");
            },
          },
          mutations: {
            onError: async (err: unknown) => captureException(err),
          },
        },
      }),
    [sendNotification],
  );

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </ReactQueryClientProvider>
  );
};
