"use client";

const Selectbox = ({ label, value, setValue, options, error }) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border ${
          error
            ? "border-red-600 focus:border-red-600"
            : "border-gray-200 focus:border-blue-600"
        } focus:bg-transparent`}
      >
        {options.map((item, i) => (
          <option key={i} value={item.value} className="capitalize">
            {item.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
    </div>
  );
};

export default Selectbox;
