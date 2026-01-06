import {
  createContext,
  type SetStateAction,
  type ReactNode,
  useState,
  useMemo,
  type Dispatch,
} from "react";

export type MobileAppView = "doses" | "medications";

const DEFAULT_MOBILE_VIEW: MobileAppView = "doses";

export const MobileAppViewContext = createContext<{
  mobileView: MobileAppView;
  setMobileView: Dispatch<SetStateAction<MobileAppView>>;
}>({
  mobileView: DEFAULT_MOBILE_VIEW,
  setMobileView: () => DEFAULT_MOBILE_VIEW,
});
MobileAppViewContext.displayName = "MobileAppViewContext";

export const MobileAppViewProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [mobileView, setMobileView] =
    useState<MobileAppView>(DEFAULT_MOBILE_VIEW);
  const contextValue = useMemo(
    () => ({ mobileView, setMobileView }),
    [mobileView, setMobileView]
  );

  return (
    <MobileAppViewContext.Provider value={contextValue}>
      {children}
    </MobileAppViewContext.Provider>
  );
};
