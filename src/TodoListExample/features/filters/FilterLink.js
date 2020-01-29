import React from 'react'
import { useFilterState, useSetFilter } from './filterStore'
import Link from './Link'

export default function FilterLink({filter, children}) {
  const visibilityFilter = useFilterState()
  const setVisibilityFilter = useSetFilter()
  return (
    <Link onClick={() => setVisibilityFilter(_ => filter)}
      active={filter === visibilityFilter}>
      {children}
    </Link>
  )
}