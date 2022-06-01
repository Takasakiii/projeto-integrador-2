import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/react";
import { useRef } from "react";

export interface FileInputProps {
  onChange: (files: FileList) => void;
}

const container = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  height: 120,
  width: 120,
});

const icon = css({
  marginBottom: "0.3rem",
});

const hiddenInput = css({
  display: "none",
});

const FileInput: React.FC<FileInputProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (files) {
      props.onChange(files);
    }
  }

  return (
    <button
      css={container}
      className="button is-success"
      type="button"
      onClick={handleButtonClick}
    >
      <FontAwesomeIcon icon={faUpload} css={icon} />
      Enviar Imagem
      <input
        type="file"
        css={hiddenInput}
        ref={fileInputRef}
        accept=".jpg,.jpeg,.png,.gif"
        multiple
        onChange={handleFileChange}
      />
    </button>
  );
};

export default FileInput;
