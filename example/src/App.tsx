import React from 'react'
import { graphql, useLazyLoadQuery } from 'react-relay'

import { AppQuery } from './__generated__/AppQuery.graphql'

export default function App() {
  let data = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        ships {
          id
          name
        }
      }
    `,
    {}
  )

  return (
    <>
      <h1>
        <a href="https://www.spacex.com" target="_blank">
          SpaceX
        </a>{' '}
        Data Viewer
      </h1>
      <h2 id="ships-heading">Ships</h2>
      <ul aria-labelledby="ships-heading">
        {data.ships?.map((ship, i) => (
          <li key={ship!.id}>{ship!.name}</li>
        ))}
      </ul>
    </>
  )
}
