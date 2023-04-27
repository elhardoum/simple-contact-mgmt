import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import Loading from '../misc/Loading'
import Contact from 'src/types/Contact'
import {
  PlusCircleIcon,
  AdjustmentsHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

let MOUNTED = false

export default (props: RouteComponentProps) => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    document.title = 'Contacts'
    MOUNTED = true
    return () => void (MOUNTED = false)
  }, [])

  useEffect(() => {
    fetch(`/api/contacts?${new URLSearchParams({ search })}`)
      .then((res) => {
        if (!String(res.status).startsWith('2')) {
          throw new Error('non 2xx response')
        }

        return res.json()
      })
      .then((contacts: Contact[]) => MOUNTED && setContacts(contacts))
      .finally(() => MOUNTED && setLoading(false))
  }, [search])

  const deleteContact = async (
    e: React.MouseEvent<HTMLElement>,
    contact: Contact,
  ) => {
    e.preventDefault()

    if (!confirm('Are you sure?')) return

    const res = await fetch(`/api/contacts/${contact.id}`, {
      method: 'DELETE',
    })
      .then((r) => r.json())
      .catch((err: Error) => console.log(err))

    if (res?.success) {
      MOUNTED && setContacts(contacts.filter((c) => c.id != contact.id))
    } else {
      alert(res?.error || 'Internal server error. Please try again.')
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <h2>Contacts</h2>
        <Link
          className="bg-blue-500 flex font-medium inline-block ml-4 px-3 py-1 rounded text-sm text-white hover:opacity-75 focus:opacity-75"
          to="/contacts/new"
        >
          <PlusCircleIcon className="h-4 w-4" stroke="currentColor" />
          <span className="ml-1 text-xs tracking-wide uppercase">New</span>
        </Link>
        <span className="flex-1"></span>
        <form>
          <input
            className="w-full rounded border-gray-200 p-2 text-xs shadow-sm"
            type="text"
            placeholder="Filter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <Loading className="h-5 w-5" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-sm font-semibold tracking-wide text-left text-gray uppercase select-none bg-gray-50">
                <td className="px-4 py-2 text-xs">Name</td>
                <td className="px-4 py-2 text-xs">Email</td>
                <td className="px-4 py-2 text-xs">Phone Number</td>
                <td className="px-4 py-2 text-xs"></td>
              </tr>
            </thead>
            <tbody className="bg-white">
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-2">
                    <em className="table mx-auto my-1 text-xs text-gray-500">
                      No contacts found.
                    </em>
                  </td>
                </tr>
              )}
              {contacts.map((contact: Contact, i) => (
                <tr
                  className={`text-xs text-gray-600 ${
                    i % 2 ? 'bg-gray-50' : ''
                  }`}
                  key={i}
                >
                  <td className="px-4 py-2">
                    <span className="table">
                      <Link
                        to={`/contacts/${contact.id}`}
                        className="hover:underline text-blue-800"
                      >
                        {contact.name}
                      </Link>
                    </span>
                  </td>
                  <td className="px-4 py-2">{contact.email}</td>
                  <td className="px-4 py-2">{contact.phone || '-'}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center flex-wrap">
                      <Link
                        to={`/contacts/edit/${contact.id}`}
                        className="cursor-pointer flex hover:underline items-center"
                      >
                        <AdjustmentsHorizontalIcon
                          className="h-4 w-4 mr-1"
                          stroke="currentColor"
                        />
                        <span className="text-xs tracking-wide uppercase">
                          Edit
                        </span>
                      </Link>
                      &nbsp;&nbsp;&nbsp;
                      <a
                        href="#"
                        onClick={(e) => deleteContact(e, contact)}
                        className="cursor-pointer flex hover:underline items-center text-red-500"
                      >
                        <TrashIcon
                          className="h-4 w-4 mr-1"
                          stroke="currentColor"
                        />
                        <span className="text-xs tracking-wide uppercase">
                          Delete
                        </span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
