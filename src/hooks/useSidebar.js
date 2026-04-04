import { useState } from "react";

const useSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return { collapsed, toggleSidebar };
};

export default useSidebar;