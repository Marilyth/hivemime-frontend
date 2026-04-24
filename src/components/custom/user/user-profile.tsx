import { useQueryParam } from "../utility/use-query-param";

export function UserProfile() {
  const [userData, setUserData] = useQueryParam("id", null);

  return (
    <div>
      <h1>User Profile {userData}</h1>
      {/* User profile content goes here */}
    </div>
  );
}