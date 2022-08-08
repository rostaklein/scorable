import { Link } from "@remix-run/react";
import { HiChevronRight, HiHome } from "react-icons/hi";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  title?: string;
  breadcrumbs?: { to: string; label: string }[];
  cta?: React.ReactNode;
};

export const Layout: React.FC<Props> = ({
  children,
  title,
  breadcrumbs,
  cta,
  ...rest
}) => {
  return (
    <div className="container mx-auto px-4 lg:my-0 my-3" {...rest}>
      <div className="flex items-center flex-wrap mb-4 justify-between md:justify-start">
        <h1 className="lg:my-6 my-3 text-3xl font-bold mr-6">{title}</h1>
        {cta}
      </div>
      {breadcrumbs && (
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 mb-4">
            <>
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <HiHome className="w-4 h-4 mr-2" />
                  All games
                </Link>
              </li>
              {breadcrumbs.map((item) => (
                <li key={item.to}>
                  <div className="flex items-center">
                    <HiChevronRight className="w-6 h-6 text-gray-400" />
                    <Link
                      to={item.to}
                      className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </div>
                </li>
              ))}
            </>
          </ol>
        </nav>
      )}
      {children}
    </div>
  );
};
