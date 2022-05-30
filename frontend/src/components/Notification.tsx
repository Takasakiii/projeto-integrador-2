import { forwardRef, HTMLProps, useImperativeHandle, useState } from "react";

export type Color =
  | "primary"
  | "link"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface NotificationProps extends HTMLProps<HTMLDivElement> {
  color: Color;
  children: React.ReactNode;
}

export interface NotificationRef {
  show: () => void;
}

const NotificationComponent: React.ForwardRefRenderFunction<
  NotificationRef,
  NotificationProps
> = ({ color, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => setIsOpen(true),
  }));

  function handleClose() {
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className={`notification is-primary is-${color}`} {...props}>
      <button className="delete" onClick={handleClose}></button>
      {children}
    </div>
  );
};

const Notification = forwardRef(NotificationComponent);

export default Notification;
