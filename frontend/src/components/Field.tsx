import { forwardRef, HTMLProps } from "react";

export interface FieldProps extends HTMLProps<HTMLInputElement> {
  label: string;
}

const FieldComponent: React.ForwardRefRenderFunction<
  HTMLInputElement,
  FieldProps
> = ({ label, ...props }, ref) => {
  return (
    <div className="field">
      <label className="label">{label}:</label>
      <div className="control">
        <input className="input" {...props} ref={ref} />
      </div>
    </div>
  );
};

const Field = forwardRef(FieldComponent);

export default Field;
