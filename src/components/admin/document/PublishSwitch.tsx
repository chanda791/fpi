import Toggle from "../Toggle";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PublishSwitch = ({
  checked,
  onChange,
}: Props) => {
  return (
    <Toggle
      label="Publish Document"
      checked={checked}
      onChange={onChange}
    />
  );
};

export default PublishSwitch;