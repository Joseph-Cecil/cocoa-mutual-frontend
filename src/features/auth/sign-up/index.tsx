
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export default function SignUp() {
  return (
    <AuthLayout>
      <Card className='p-3'>
        
        <SignUpForm />
      </Card>
    </AuthLayout>
  )
}
