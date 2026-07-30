import Select from "../Select";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const categories = [
  "Advocacy",
  "Media Literacy",
  "Research",
  "Capacity Building",
  "SheRise",
  "Claim Your Space",
  "Funsani",
  "Enhancing Conflict Sensitive Journalism",
];

const ProjectCategorySelect = ({
  value,
  onChange,
}: Props) => {
  return (
    <Select
      label="Project Category"
      name="category"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    >
      {categories.map((category) => (
        <option
          key={category}
          value={category}
        >
          {category}
        </option>
      ))}
    </Select>
  );
};

export default ProjectCategorySelect;