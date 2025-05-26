import { FC } from "react";

const LandHeader: FC = () => {
  return (
    <header className="text-center py-12">
      <h1 className="text-5xl font-bold heading-gradient mb-4">FlexiCRM</h1>
      <p className="text-gray-600 text-lg">Your modular solution for CRM</p>
    </header>
  );
};

export default LandHeader;
