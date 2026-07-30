import Select from "../Select";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ProjectStatusSelect = ({
  value,
  onChange,
}: Props) => {
  return (
    <Select
      label="Project Status"
      name="status"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    >
      <option value="Planning">
        Planning
      </option>

      <option value="Ongoing">
        Ongoing
      </option>

      <option value="Completed">
        Completed
      </option>

      <option value="Suspended">
        Suspended
      </option>
    </Select>
  );
};

export default ProjectStatusSelect;