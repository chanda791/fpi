import ImageUpload from "../ImageUpload";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

const ProjectImagePicker = ({
  value,
  onChange,
}: Props) => {
  return (
    <ImageUpload
      label="Project Image"
      value={value}
      onChange={onChange}
    />
  );
};

export default ProjectImagePicker;