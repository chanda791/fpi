import FileUpload from "../FileUpload";

interface Props {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

const DocumentUpload = ({
  value,
  onChange,
  onUploadingChange,
}: Props) => {
  return (
    <FileUpload
      label="Document File"
      value={value}
      onChange={onChange}
      onUploadingChange={onUploadingChange}
    />
  );
};

export default DocumentUpload;