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
};

export const Input: React.FC<Props> = ({
  label,
  name,
  error,
  initialValue,
  ...rest
}) => {
  const [val, setVal] = useState<string>(initialValue ?? "");
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className={twMerge(
            "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300",
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
            ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
            : "bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        )}
        name={name}
        placeholder={label}
        onChange={(e) => setVal(e.target.value)}
        value={val}
        {...rest}
      />

      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
        {error && <span>{error}</span>}
      </p>
    </div>
  );
};
