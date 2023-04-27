import React from 'react'
import LoadingProps from 'src/types/LoadingProps'

export default (props: Partial<LoadingProps>) => (
  <img src="/assets/ajax-loader.gif" alt="Loading..." {...props} />
)
