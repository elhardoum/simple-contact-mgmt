import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Contact from './../../types/Contact'
import Form from './Form'
import { apiurl, assertJson2xx } from './../../helpers'

let MOUNTED = false

export default (props: RouteComponentProps) => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)
  const [contact, setContact] = useState<Contact>({
    name: '',
    email: '',
  })

  useEffect(() => {
    document.title = 'New Contact'
    MOUNTED = true
    return () => void (MOUNTED = false)
  }, [])

  const submit = async (data: Contact) => {
    setContact({ ...contact, ...data })
    setUpdateLoading(true)

    const res = await fetch(apiurl(`/contacts`), {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(assertJson2xx)
      .catch((error: Error) => ({ success: false, error }))
      .finally(() => MOUNTED && setUpdateLoading(false))

    if (!res?.success) {
      alert(res?.error || 'Internal server error. Please try again.')
    } else {
      props.history.push('/contacts')
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <h2>Contacts &rsaquo; Add New</h2>
      </div>

      <Form
        contact={contact}
        onSubmit={(data) => submit(data)}
        loading={updateLoading}
      />
    </>
  )
}
