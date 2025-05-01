import {

  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'


export const userTypes = [
  {
    label: 'Admin',
    value: 'admin',
    icon: IconUserShield,
  },
  {
    label: 'Staff',
    value: 'staff',
    icon: IconUsersGroup,
  },
] as const
