import { ReactNode, useEffect, useRef } from "react";

// コンポーネントの外側で発生したクリックをハンドリングする
// https://stackoverflow.com/a/42234988
function useOutsideClickHandler(
  ref: React.RefObject<HTMLDivElement>,
  onClick: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

function ClickAwayListener(props: {
  onClick: () => void;
  children: ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClickHandler(wrapperRef, props.onClick);

  return <div ref={wrapperRef}>{props.children}</div>;
}

export default ClickAwayListener;
