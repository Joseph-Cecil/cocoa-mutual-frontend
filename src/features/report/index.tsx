import { Header } from "@/components/layout/header"
import {DataTable} from "../../components/report-table/data-table"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Main } from "@/components/layout/main"

export default function Report() {
    return (
        <>
        <Header sticky>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                  <ThemeSwitch />
                  <ProfileDropdown />
                </div>
              </Header>
              <Main>
        <div className="flex min-h-screen flex-col items-center justify-center -mt-10">
            <div className="w-full max-w-7xl">
                <DataTable/>
            </div>
        </div>
        </Main>
        </>
    )
}