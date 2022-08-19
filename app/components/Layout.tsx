import { Link, useMatches } from "@remix-run/react";
import { HiChartBar, HiChevronRight, HiHome } from "react-icons/hi";
import { AiOutlineGithub } from "react-icons/ai";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  title?: string;
  displayBreadcrumbs?: boolean;
  cta?: React.ReactNode;
};

export const Layout: React.FC<Props> = ({
  children,
  title,
  displayBreadcrumbs = false,
  cta,
  ...rest
}) => {
  const matches = useMatches();

  const makeBreadCrumbs = () => {
    if (!displayBreadcrumbs) {
      return [];
    }
    return [...matches]
      .slice(1, matches.length)
      .filter(({ id }) => !id.endsWith("index"))
      .map(({ id, data, pathname }) => {
        switch (id) {
          case "routes/games/$gameId":
            return {
              to: pathname,
              label: `Game: ${data?.game?.name}`,
            };
          case "routes/games/$gameId/rounds/$roundId":
            return {
              to: pathname,
              label: `Round #${data?.round?.order}`,
            };
          default:
            throw new Error(`Unrecognized path in breadcrumbs "${id}"".`);
        }
      });
  };

  return (
    <div
      className="container mx-auto px-4 pb-8 md:pb-4 lg:my-0 my-3 flex flex-col min-h-screen justify-between"
      {...rest}
    >
      <div>
        <div className="flex items-center flex-wrap mb-4 justify-between md:justify-start">
          <h1 className="lg:my-6 my-3 text-3xl font-bold mr-6">{title}</h1>
          {cta}
        </div>
        {displayBreadcrumbs && (
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 mb-4 overflow-x-auto">
              <>
                <li className="inline-flex items-center">
                  <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 truncate"
                  >
                    <HiHome className="w-4 h-4 mr-2" />
                    All games
                  </Link>
                </li>
                {makeBreadCrumbs().map((item) => (
                  <li key={item.to}>
                    <div className="flex items-center">
                      <HiChevronRight className="w-6 h-6 text-gray-400" />
                      <Link
                        to={item.to}
                        className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 truncate"
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
      <footer className="mt-6 md:mt-12 flex flex-col items-center justify-center mb-4">
        <div className="font-semibold text-lg">
          <span className="text-gray-500">
            <HiChartBar className="inline-block rotate-180 mr-1 mt-[2px]" />
            scorable
          </span>
          <span className="text-gray-300">.online</span>
        </div>
        <div className="text-xs text-gray-400 mt-3">
          Brought to you with <span className="opacity-30">❤️</span>
          <span className="mx-2">|</span>
          <AiOutlineGithub className="inline-block mr-1" />
          <a
            href="https://github.com/rostaklein/scorable"
            target="_blank"
            rel="noreferrer"
          >
            github repo
          </a>
        </div>
      </footer>
    </div>
  );
};
