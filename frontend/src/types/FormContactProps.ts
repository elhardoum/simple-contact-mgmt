import Contact from './Contact'

export interface FormContactProps {
  contact: Contact
  onSubmit: (contact: Contact) => void
  loading?: boolean
}
