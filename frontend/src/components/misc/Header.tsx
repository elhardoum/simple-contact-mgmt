import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <header aria-label="Site Header" className="bg-white shadow">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 flex items-center">
            <span className="sr-only">Home</span>
            <Link
              className="font-bold no-underline text-black text-xl tracking-tight uppercase"
              to="/"
            >
              Simple Contact MGMT
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <div className="flex items-center gap-4">
              <div className="flex flex-1 items-center justify-end gap-4">
                <Link
                  className="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white"
                  to="/contacts/new"
                >
                  Add Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
