import { css } from "@emotion/react";
import { HTMLProps } from "react";

const container = css({
  display: "flex",
  justifyContent: "center",
  paddingTop: "4rem",
});

const box = css({
  width: "clamp(300px, 30%, 600px)",
});

const Form: React.FC<HTMLProps<HTMLFormElement>> = ({ children, ...props }) => {
  return (
    <div css={container}>
      <form className="box" css={box} {...props}>
        {children}
      </form>
    </div>
  );
};

export default Form;
