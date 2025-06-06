
interface InputboxProps {
  label: string;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  value: string;
  setValue: (value: string) => void;
  error?: string;
}

const Inputbox: React.FC<InputboxProps> = ({
  label,
  type = "text",
  placeholder = "",
  readOnly = false,
  value,
  setValue,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="text-sm text-slate-800 font-medium mb-2 block"
      >
        {label}
      </label>
      <input
        id={label}
        name={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        readOnly={readOnly}
        className={`w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border ${
          error
            ? "border-red-600 focus:border-red-600"
            : "border-gray-200 focus:border-blue-600"
        } focus:bg-transparent`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Inputbox;
