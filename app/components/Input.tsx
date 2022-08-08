import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  name: string;
  error?: string | null;
  initialValue?: string;
  wrapperClassname?: string;
};

export const Input: React.FC<Props> = ({
  label,
  name,
  error,
  initialValue,
  className,
  wrapperClassname,
  ...rest
}) => {
  const [val, setVal] = useState<string>(initialValue ?? "");
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
