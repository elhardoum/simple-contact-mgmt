import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loading from '../misc/Loading'
import Contact from './../../types/Contact'
import Form from './Form'
import { assertJson2xx, apiurl } from './../../helpers'

let MOUNTED = false

export default (props: RouteComponentProps<{ id?: string }>) => {
  const [contact, setContact] = useState<Contact>()
  const [loading, setLoading] = useState<boolean>(true)
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)

  useEffect(() => {
    document.title = 'Edit Contact'
    MOUNTED = true

    fetch(apiurl(`/contacts/${props.match.params.id}`))
      .then(assertJson2xx)
      .then((contact: Contact) => MOUNTED && setContact(contact))
      .finally(() => MOUNTED && setLoading(false))

    return () => void (MOUNTED = false)
  }, [])

  useEffect(() => {
    if (!loading && !contact?.id) {
      props.history.replace('/contacts')
    }
  }, [loading, contact])

  const submit = async (data: Contact) => {
    setContact({ ...contact, ...data })
    setUpdateLoading(true)

    const res = await fetch(apiurl(`/contacts/${contact.id}`), {
      method: 'PATCH',
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
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <h2>Contacts &rsaquo; Edit</h2>
      </div>

      {loading ? (
        <Loading className="h-5 w-5" />
      ) : contact?.id ? (
        <Form
          contact={contact}
          onSubmit={(data) => submit(data)}
          loading={updateLoading}
        />
      ) : (
        <p className="italic text-sm text-red-400">Contact Not Found.</p>
      )}
    </>
  )
}
