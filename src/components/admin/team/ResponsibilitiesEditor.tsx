
import TextArea from "../TextArea";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

const ResponsibilitiesEditor = ({
  value,
  onChange,
}: Props) => {
  return (
    <TextArea
      label="Responsibilities"
      name="responsibilities"
      rows={6}
      helperText="One responsibility per line."
      value={value.join("\n")}
      onChange={(e) =>
        onChange(
          e.target.value
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      }
    />
  );
};

export default ResponsibilitiesEditor;