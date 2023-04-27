import React, { useEffect, useState, useRef } from 'react'
import Loading from '../misc/Loading'
import { FormContactProps } from 'src/types/FormContactProps'

export default (props: FormContactProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')

  const nameRef = useRef(null)
  const emailRef = useRef(null)

  useEffect(() => {
    setName(props.contact.name)
    setEmail(props.contact.email)
    setPhone(props.contact.phone || '')
    setLoading(!!props.loading)
  }, [props])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name || 0 == name.trim().length) {
      return nameRef.current.focus()
    }

    if (!email || email.trim().length < 6) {
      return emailRef.current.focus()
    }

    if (!/^.{1,}\@.{1,}\..{1,}$/.test(email)) {
      return emailRef.current.focus()
    }

    props.onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
    })
  }

  return (
    <form method="post" onSubmit={(e) => submit(e)}>
      <table className="w-full text-xs shadow">
        <tbody className="bg-white">
          <tr className="bg-gray-50">
            <td className="px-4 py-2">
              <strong>Name</strong>
            </td>
            <td className="px-4 py-2">
              <input
                className="w-full rounded-lg border-gray-200 px-4 py-2 text-sm shadow-sm"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                ref={nameRef}
              />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">
              <strong>Email Address</strong>
            </td>
            <td className="px-4 py-2">
              <input
                className="w-full rounded-lg border-gray-200 px-4 py-2 text-sm shadow-sm"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                ref={emailRef}
              />
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="px-4 py-2">
              <strong>Phone Number</strong>
            </td>
            <td className="px-4 py-2">
              <input
                className="w-full rounded-lg border-gray-200 px-4 py-2 text-sm shadow-sm"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex items-center mt-4">
        <button
          type="submit"
          className="inline-block rounded bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:opacity-75"
          disabled={loading}
        >
          Save Changes
        </button>

        <div className={`ajax-loader ml-3 ${loading ? '' : 'hidden'}`}>
          <Loading className="h-5" />
        </div>
      </div>
    </form>
  )
}
