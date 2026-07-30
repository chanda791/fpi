import Select from "../Select";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ProgramSelect = ({
  value,
  onChange,
}: Props) => {
  return (
    <Select
      label="Project / Activity"
      name="program"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="Advocacy">Advocacy</option>
      <option value="Media Literacy">Media Literacy</option>
      <option value="Research">Research</option>
      <option value="Capacity Building">Capacity Building</option>
      <option value="SheRise">SheRise</option>
      <option value="Claim Your Space">Claim Your Space</option>
      <option value="Funsani">Funsani</option>
      <option value="Enhancing Conflict Sensitive Journalism">
        Enhancing Conflict Sensitive Journalism
      </option>
    </Select>
  );
};

export default ProgramSelect;