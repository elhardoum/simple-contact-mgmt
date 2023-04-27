import React, { useEffect } from 'react'

export default () => {
  useEffect(() => {
    document.title = 'Page Not Found (404)'
  }, [])

  return (
    <div className="flex h-full items-center w-full">
      <h1 className="flex-1 text-center">404 - page not found</h1>
    </div>
  )
}
