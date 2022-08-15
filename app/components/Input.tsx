import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useDebounce } from "~/hooks/useDebounce";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  name: string;
  error?: string | null;
  initialValue?: string;
  wrapperClassname?: string;
  onDebouncedValueChange?: (val: string) => void;
};

export const Input: React.FC<Props> = ({
  label,
  name,
  error,
  initialValue,
  className,
  wrapperClassname,
  onDebouncedValueChange,
  ...rest
}) => {
  const [val, setVal] = useState<string>(initialValue ?? "");
  const debouncedValue = useDebounce(val);

  useEffect(() => {
    if (!onDebouncedValueChange || val === initialValue || val === "") {
      return;
    }
    onDebouncedValueChange(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className={wrapperClassname}>
      {label && (
        <label
          htmlFor={name}
          className={twMerge(
            "block mb-2 text-sm font-medium text-gray-900",
            error && "text-red-700"
          )}
        >
          {label}
        </label>
      )}
      <input
        type="text"
        id={name}
        className={twMerge(
          "border  text-sm rounded-md block w-full p-2.5",
          error
            ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 block"
            : "bg-gray-50 border-gray-300 text-gray-900",
          className
        )}
        name={name}
        placeholder={label}
        onChange={(e) => setVal(e.target.value)}
        value={val}
        {...rest}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error && <span>{error}</span>}
        </p>
      )}
    </div>
  );
};
