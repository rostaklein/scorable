import { twMerge } from "tailwind-merge";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { size?: "small" | "regular" };

export const Button: React.FC<Props> = ({
  children,
  title,
  size = "regular",
  ...rest
}) => {
  return (
    <button
      type="submit"
      className={twMerge(
        "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
        size === "regular" && "text-sm px-5 py-2.5",
        size === "small" && "text-sm px-3 py-1.5"
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
