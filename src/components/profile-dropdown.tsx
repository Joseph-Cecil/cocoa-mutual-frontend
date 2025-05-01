import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useLogout from '@/hooks/useLogout';
import { useNavigate } from '@tanstack/react-router';
import { fetchUserProfile } from '@/api/userApi';
import { ProfileData } from 'types/profile';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

export function ProfileDropdown() {
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const logout = useLogout();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUserProfile(data);
    
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }catch(err){
        setError("Failed to fetch user Profile.");
      }finally{
        setLoading(false);
      }
    }
    loadProfile();
  }, [userProfile]);

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="h-8 w-8 rounded-lg">
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    );
  }

  // Generate initials or fallback to '?'
  const initials = error
    ? "?"
    : `${userProfile?.firstName?.[0] || ""}${userProfile?.lastName?.[0] || ""}`.toUpperCase();

  
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{userProfile?.firstName}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=> navigate({to:"/settings/account"})}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({to: '/settings/notifications'})}>
            Notifications
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
