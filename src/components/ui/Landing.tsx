import { FC } from "react";
import Link from "next/link";
import LandHeader from "./LandHeader";
import LandFooter from "./LandFooter";
// todo: refactor links in here
// todo: redo landing, messy
const Landing: FC = () => {
  return (
    <>
      <LandHeader />
      <main>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card">
            <h2 className="text-xl font-semibold mb-3">For Freelancers</h2>
            <p className="text-gray-600">Track clients and projects</p>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-3">For Job Seekers</h2>
            <p className="text-gray-600">Organize applications</p>
          </div>
          <div className="card">
            <Link href="/demo/dungeonsdragons">
              <h2 className="text-xl font-semibold mb-3">For Gamers</h2>
              <p className="text-gray-600">
                Manage gaming sessions, click here
              </p>
            </Link>
          </div>
        </div>
      </main>
      <LandFooter />
    </>
  );
};

export default Landing;
