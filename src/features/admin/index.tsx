import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { columns } from "./components/users-columns";
import { UsersDialogs } from "./components/users-dialogs";
import { UsersPrimaryButtons } from "./components/users-primary-buttons";
import { UsersTable } from "./components/users-table";
import UsersProvider from "./context/users-context";
import { userListSchema, User } from "./data/schema";
import { getAllUsers } from "../../api/adminApi";
import { UsersTableSkeleton } from "./components/TableSkeleton";

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]); // Store users in state
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track errors

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getAllUsers();

        const parsedUsers = userListSchema.parse(fetchedUsers); // Validate data

        setUsers(parsedUsers); // Update state with fetched users
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch users:", error);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(); // Call the function when component mounts
  }, []); // Empty dependency array ensures it runs only once

  if (loading) return (
    <div>
      <UsersTableSkeleton columns={9}/>
    </div>
  );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <UsersProvider>
      <Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Staff List</h2>
            <p className="text-muted-foreground">
              Manage staff and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <UsersTable data={users} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  );
}
