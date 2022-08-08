import { twMerge } from "tailwind-merge";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { size?: "small" | "regular"; color?: "regular" | "green" };

export const Button: React.FC<Props> = ({
  children,
  title,
  size = "regular",
  color = "regular",
  className,
  ...rest
}) => {
  return (
    <button
      type="submit"
      className={twMerge(
        "font-medium rounded-lg text-sm transition-all h-10",
        size === "regular" && "text-sm px-5 py-2",
        size === "small" && "text-sm px-3 py-1.5",
        color === "regular" &&
          "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
        color === "green" &&
          "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-600 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
