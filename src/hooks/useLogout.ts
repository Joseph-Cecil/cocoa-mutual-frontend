// hooks/useLogout.ts
import { useNavigate } from '@tanstack/react-router'


const useLogout = () => {
    const navigate = useNavigate();

  const logout = (): void => {
    // Remove token from local storage
    localStorage.removeItem("token");

    // Optionally, clear user-related data
    localStorage.removeItem("user");
    // Redirect to the login page
    navigate({to: "/sign-in"});
    
  };

  return logout;
};

export default useLogout;
