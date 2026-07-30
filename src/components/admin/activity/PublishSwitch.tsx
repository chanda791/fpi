import Input from "../Input";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const DatePicker = ({
  value,
  onChange,
}: DatePickerProps) => {
  return (
    <Input
      label="Activity Date"
      name="date"
      type="date"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    />
  );
};

export default DatePicker;