import Select from "../Select";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const DocumentCategorySelect = ({
  value,
  onChange,
}: Props) => {
  return (
    <Select
      label="Document Type"
      name="category"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    >
      <option value="Report">Report</option>

      <option value="Newsletter">
        Newsletter
      </option>

      <option value="Publication">
        Publication
      </option>

      <option value="Press Statement">
        Press Statement
      </option>
    </Select>
  );
};

export default DocumentCategorySelect;