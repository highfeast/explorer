import { useSiweIdentity } from "ic-use-siwe-identity";
import { useEffect, useState } from "react";
import {
  DashboardWrapper,
  LayoutContent,
  LayoutFooter,
} from "./lib/components/template/dashboard-wrapper";
import { useActor } from "./ic/Actors";
import Overview from "./lib/components/organisms/overview";
import SignUp from "./lib/components/organisms/signup";
import NewRecipe from "./lib/components/organisms/new-recipe";

function App() {
  const { identity } = useSiweIdentity();
  const { actor } = useActor();
  const [principal, setPrincipal] = useState<null | string>(null);
  const [onboard, setOnboard] = useState(false);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(false);
  const toggleHome = () => setTabIndex(!tabIndex);

  async function fetchIdentity() {
    const _principal = identity.getPrincipal();
    setPrincipal(_principal.toText());
  }

  async function checkProfile() {
    if (!principal) {
      return;
    }
    try {
      const response = await actor.getMyProfile();
      if (response[0]) {
        console.log(response[0]);
        setMyProfile(response[0]);
        setOnboard(false);
      } else {
        setOnboard(true);
      }
    } catch (e) {
      console.log("found this error", e.message);
    }
  }

  useEffect(() => {
    if (identity && !principal) {
      fetchIdentity();
    }
  }, [principal, identity]);

  useEffect(() => {
    if (principal && !myProfile && !onboard) {
      checkProfile();
    }
  }, [principal, myProfile, onboard]);

  return (
    <>
      <DashboardWrapper>
        <LayoutContent>
          {tabIndex ? (
            <Overview toggleHome={toggleHome} />
          ) : (
            <NewRecipe toggleHome={toggleHome} />
          )}
        </LayoutContent>

        {tabIndex && (
          <LayoutFooter>
            <p>&copy; 2024 Highfeast Explorer</p>
          </LayoutFooter>
        )}
      </DashboardWrapper>

      <SignUp isOpen={onboard} toggleSignup={() => setOnboard(!onboard)} />
    </>
  );
}

export default App;
