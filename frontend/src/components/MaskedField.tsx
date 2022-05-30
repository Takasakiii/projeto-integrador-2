import { forwardRef } from "react";
import ReactInputMask, { Mask } from "react-text-mask";

export interface MaskedFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  mask: Mask | ((value: string) => Mask);
}

const MaskedFieldComponent: React.ForwardRefRenderFunction<
  never,
  MaskedFieldProps
> = ({ label, mask, ...props }, ref) => {
  return (
    <div className="field">
      <label className="label">{label}:</label>
      <div className="control">
        <ReactInputMask mask={mask} className="input" {...props} ref={ref} />
      </div>
    </div>
  );
};

const MaskedField = forwardRef(MaskedFieldComponent);

export default MaskedField;
