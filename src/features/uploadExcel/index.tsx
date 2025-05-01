import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { Header } from '../../components/layout/header'
import { UploadExcelPage } from "./uploadExcel";
import { Main } from '../../components/layout/main'

export default function UploadExcel() {
    return (
       <>    <Header sticky>
                   <Search />
                   <div className='ml-auto flex items-center space-x-4'>
                     <ThemeSwitch />
                     <ProfileDropdown />
                   </div>
                 </Header>
                 <Main>
                    <UploadExcelPage/>    
                </Main> 
                 
        </>
    )
}