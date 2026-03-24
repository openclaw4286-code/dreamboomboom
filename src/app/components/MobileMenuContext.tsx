import { createContext, useContext } from "react";

const MobileMenuContext = createContext<() => void>(() => {});
export const useMobileMenu = () => useContext(MobileMenuContext);
export default MobileMenuContext;
