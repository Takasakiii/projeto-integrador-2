import {
  forwardRef,
  HTMLProps,
  MouseEvent,
  useImperativeHandle,
  useState,
} from "react";
import { css } from "@emotion/react";
import FileInput from "./FileInput";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface FileListRef {
  getFiles: () => File[];
}

const fileUploadContainer = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, 120px)",
  justifyContent: "space-between",
  gap: "1rem",
});

const imageContainer = css({
  position: "relative",
});

const removeButton = css({
  borderRadius: "50%",
  width: "1.6rem",
  height: "1.6rem",
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  zIndex: 1,
  top: "-0.5rem",
  right: "-0.5rem",
});

const FileListComponent: React.ForwardRefRenderFunction<
  FileListRef,
  HTMLProps<HTMLInputElement>
> = (props, ref) => {
  const [files, setFiles] = useState<File[]>([]);

  useImperativeHandle(ref, () => ({
    getFiles() {
      return files;
    },
  }));

  function handleAddFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if (!file) break;

      setFiles((prevFiles) => [...prevFiles, file]);
    }
  }

  function handleRemoveFile(e: MouseEvent<HTMLButtonElement>) {
    const index = parseInt(e.currentTarget.getAttribute("data-index") ?? "0");
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  return (
    <div className="field">
      <label className="label">Imagens:</label>
      <div css={fileUploadContainer} {...props}>
        {files.map((file, index) => {
          const fileUrl = URL.createObjectURL(file);
          return (
            <div key={index} css={imageContainer}>
              <button
                type="button"
                className="button is-danger"
                css={removeButton}
                data-index={index}
                onClick={handleRemoveFile}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <Image
                src={fileUrl}
                layout="fixed"
                alt="Imagem a ser enviada."
                width={120}
                height={120}
              />
            </div>
          );
        })}
        <FileInput onChange={handleAddFiles} />
      </div>
    </div>
  );
};

const FileList = forwardRef(FileListComponent);

export default FileList;
