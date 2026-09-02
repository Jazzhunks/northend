import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
//#region src/legacy/sidebar.d.ts
declare function useSidebar(): {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  closeOnRedirect: RefObject<boolean>;
};
declare function SidebarProvider({ children }: {
  children: ReactNode;
}): import("react").JSX.Element;
//#endregion
export { SidebarProvider, useSidebar };