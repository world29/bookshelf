import { useEffect } from "react";

import "./../styles/ContextMenu.css";

type MenuItemProps = {
  label: string;
  onClick: () => void;
};

type Props = {
  menuItems: MenuItemProps[];
  top: number;
  left: number;
  onClose: () => void;
};

const ContextMenu = (props: Props) => {
  const { menuItems, top, left, onClose } = props;

  const handleClickAway = () => {
    onClose();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickAway);

    return () => {
      document.removeEventListener("click", handleClickAway);
    };
  }, []);

  return (
    <div className="context-menu" style={{ top: top, left: left }}>
      {menuItems.map((item, key) => (
        <div key={key} onClick={() => item.onClick()}>
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
