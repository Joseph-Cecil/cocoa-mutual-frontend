import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Change Password'
      desc='Change your password here.'
    >
      <AccountForm />
    </ContentSection>
  )
}
