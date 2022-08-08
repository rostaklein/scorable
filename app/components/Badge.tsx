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
        return "bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded";
      case "green":
        return "bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded";
      case "indigo":
        return "bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded";
      case "purple":
        return "bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded";
      case "pink":
        return "bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded";
      case "blue":
        return "bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded";
      case "gray":
      default:
        return "bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded";
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
