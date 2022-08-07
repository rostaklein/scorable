import { twMerge } from "tailwind-merge";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  color?:
    | "gray"
    | "red"
    | "green"
    | "yellow"
    | "indigo"
    | "purple"
    | "pink"
    | "blue";
  tooltip?: string;
};

export const Badge: React.FC<Props> = ({
  color,
  className,
  children,
  tooltip,
  ...rest
}) => {
  const getColor = () => {
    switch (color) {
      case "red":
        return "bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900";
      case "green":
        return "bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900";
      case "indigo":
        return "bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-200 dark:text-indigo-900";
      case "purple":
        return "bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-200 dark:text-purple-900";
      case "pink":
        return "bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-pink-200 dark:text-pink-900";
      case "blue":
        return "bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800";
      case "gray":
      default:
        return "bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <span
      className={twMerge(
        getColor(),
        "inline-flex my-1 items-center space-x-1",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};
