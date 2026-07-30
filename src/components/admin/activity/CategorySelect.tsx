import Select from "../Select";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect = ({
  value,
  onChange,
}: Props) => {
  return (
    <Select
      label="Category"
      name="category"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="Training">Training</option>
      <option value="Workshop">Workshop</option>
      <option value="Conference">Conference</option>
      <option value="Dialogue">Dialogue</option>
      <option value="Community Engagement">
        Community Engagement
      </option>
      <option value="Campaign">Campaign</option>
      <option value="Research">Research</option>
      <option value="Media Engagement">
        Media Engagement
      </option>
      <option value="Monitoring">Monitoring</option>
      <option value="Publication">Publication</option>
    </Select>
  );
};

export default CategorySelect;