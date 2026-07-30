import FileUpload from "../FileUpload";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

const DocumentUpload = ({
  value,
  onChange,
}: Props) => {
  return (
    <FileUpload
      label="Document File"
      value={value}
      onChange={onChange}
    />
  );
};

export default DocumentUpload;