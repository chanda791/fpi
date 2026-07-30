import Select from "../Select";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ProvinceSelect = ({
  value,
  onChange,
}: Props) => {
  return (
    <Select
      label="Province"
      name="location"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="Central">Central</option>
      <option value="Copperbelt">Copperbelt</option>
      <option value="Eastern">Eastern</option>
      <option value="Luapula">Luapula</option>
      <option value="Lusaka">Lusaka</option>
      <option value="Muchinga">Muchinga</option>
      <option value="Northern">Northern</option>
      <option value="North-Western">North-Western</option>
      <option value="Southern">Southern</option>
      <option value="Western">Western</option>
    </Select>
  );
};

export default ProvinceSelect;