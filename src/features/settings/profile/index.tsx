import ContentSection from '../components/content-section'
import { ProfileForm } from './profile-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Profile'
      desc='Find your profile Details Here. You cannot update, Kindly contact administrator to make any changes.'
    >
      <ProfileForm />
    </ContentSection>
  )
}
