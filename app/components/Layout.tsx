type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { title?: string };

export const Layout: React.FC<Props> = ({ children, title, ...rest }) => {
  return (
    <div className="container mx-auto px-4" {...rest}>
      {title && <h1 className="my-4 text-3xl font-bold">{title}</h1>}
      {children}
    </div>
  );
};
