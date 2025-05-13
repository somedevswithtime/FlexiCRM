import { FC } from "react";

const LandFooter: FC = () => {
  return (
    <footer className="text-center py-6 border-t text-sm text-gray-500">
      <p>Under active development</p>
      <div className="mt-2">
        <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>
      </div>
    </footer>
  );
};

export default LandFooter;
