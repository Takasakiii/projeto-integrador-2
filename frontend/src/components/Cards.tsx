import { css } from "@emotion/react";
import { HTMLProps } from "react";

const container = css({
  display: "flex",
  justifyContent: "center",
  paddingTop: "4rem",
  marginBottom: "2rem",

  "@media (max-height: 700px)": {
    paddingTop: "1rem",
  },
});

const box = css({
  width: "clamp(300px, 40%, 600px)",
});

export const Form: React.FC<HTMLProps<HTMLFormElement>> = ({
  children,
  ...props
}) => {
  return (
    <div css={container}>
      <form className="box" css={box} {...props}>
        {children}
      </form>
    </div>
  );
};

export const Card: React.FC<HTMLProps<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <div css={container}>
      <div className="box" css={box} {...props}>
        {children}
      </div>
    </div>
  );
};
