import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import Loading from '../misc/Loading'
import Contact from 'src/types/Contact'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { apiurl, assertJson2xx } from './../../helpers'

let MOUNTED = false

export default (props: RouteComponentProps<{ id?: string }>) => {
  const [contact, setContact] = useState<Contact>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    document.title = 'Contact Info'
    MOUNTED = true

    fetch(apiurl(`/contacts/${props.match.params.id}`))
      .then(assertJson2xx)
      .then((contact: Contact) => MOUNTED && setContact(contact))
      .finally(() => MOUNTED && setLoading(false))

    return () => void (MOUNTED = false)
  }, [])

  return (
    <>
      <div className="mb-4 flex items-center">
        <h2>Contacts &rsaquo; {contact?.name || loading || '(not found)'}</h2>
        {!!contact?.id && (
          <Link
            className="bg-blue-500 flex font-medium inline-block ml-4 px-3 py-1 rounded text-sm text-white hover:opacity-75 focus:opacity-75"
            to={`/contacts/edit/${contact.id}`}
          >
            <AdjustmentsHorizontalIcon
              className="h-4 w-4"
              stroke="currentColor"
            />
            <span className="ml-1 text-xs tracking-wide uppercase">Edit</span>
          </Link>
        )}
      </div>

      {loading ? (
        <Loading className="h-5 w-5" />
      ) : contact?.id ? (
        <div>
          <table className="w-full text-xs">
            <tbody className="bg-white">
              <tr className="bg-gray-50">
                <td className="px-4 py-2">
                  <strong>Name</strong>
                </td>
                <td className="px-4 py-2">{contact.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">
                  <strong>Email Address</strong>
                </td>
                <td className="px-4 py-2">{contact.email}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2">
                  <strong>Phone Number</strong>
                </td>
                <td className="px-4 py-2">{contact.phone || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="italic text-sm text-red-400">Contact Not Found.</p>
      )}
    </>
  )
}
