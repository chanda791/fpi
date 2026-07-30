import ImageUpload from "../ImageUpload";

interface TeamImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

const TeamImagePicker = ({
  value,
  onChange,
}: TeamImagePickerProps) => {
  return (
    <ImageUpload
      label="Profile Photo"
      value={value}
      onChange={onChange}
    />
  );
};

export default TeamImagePicker;