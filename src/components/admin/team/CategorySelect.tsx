
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
      label="Department"
      name="category"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="Board of Directors">
        Board of Directors
      </option>

      <option value="Management">
        Management
      </option>

      <option value="Programs">
        Programs
      </option>

      <option value="Projects">
        Projects
      </option>

      <option value="Media and Communications">
        Media and Communications
      </option>

      <option value="Finance">
        Finance
      </option>

      <option value="Administration">
        Administration
      </option>

      <option value="Monitoring and Evaluation">
        Monitoring and Evaluation
      </option>

      <option value="Research">
        Research
      </option>

      <option value="Consultants">
        Consultants
      </option>
    </Select>
  );
};

export default CategorySelect;