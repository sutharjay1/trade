interface Props {
  children: React.ReactNode;
}
const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col gap-4 md:min-h-[calc(100vh-1rem)] max-w-7xl mx-auto px-4 md:px-0 pb-40">
      {children}
    </div>
  );
};

export default Layout;
