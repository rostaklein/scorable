type TimelineItem = {
  label: string;
  value: string;
};

type Props = {
  items: TimelineItem[];
};

export const Timeline: React.FC<Props> = ({ items }) => {
  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700">
      {items.map((item) => (
        <li className="mb-10 ml-4" key={item.label}>
          <h3 className="text-md font-semibold text-gray-900 dark:text-white">
            {item.label}
          </h3>
          <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            {item.value}
          </time>
        </li>
      ))}
    </ol>
  );
};
