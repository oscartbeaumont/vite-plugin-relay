import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import {
  createMockEnvironment,
  MockPayloadGenerator,
  RelayMockEnvironment,
} from 'relay-test-utils'
import { RelayEnvironmentProvider } from 'react-relay'

import App from './App'
import { AppQueryResponse } from './__generated__/AppQuery.graphql'
import { GraphQLResponseWithData as RelayGraphQLResponseWithData } from 'relay-runtime'

// Mutable removes the readonly property from a type. This is done because the Relay compiler outputs types with readonly fields.
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

// GraphQLResponseWithData is a generic which allows the type of the 'data' field to be modified
interface GraphQLResponseWithData<T>
  extends Omit<RelayGraphQLResponseWithData, 'data'> {
  data: T
}

describe('Test <App />', () => {
  var environment: RelayMockEnvironment

  beforeEach(async () => {
    environment = createMockEnvironment()
    const { queryByText } = render(
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback={<h1>Loading</h1>}>
          <App />
        </Suspense>
      </RelayEnvironmentProvider>
    )
  })

  const waitForSuspense = async () => {
    // Wait for the Suspense fallback component to disappear
    const loader = screen.getByText('Loading')
    expect(loader).toBeInTheDocument()
    await waitForElementToBeRemoved(loader)
  }

  test('renders title within a link', async () => {
    environment.mock.resolveMostRecentOperation(operation =>
      MockPayloadGenerator.generate(operation)
    )
    await waitForSuspense()

    const title = screen.queryByText('SpaceX')
    expect(title).toBeInTheDocument()
    expect(title!.closest('a')).toHaveAttribute(
      'href',
      'https://www.spacex.com'
    )
  })

  test('renders list with a no ships', async () => {
    environment.mock.resolveMostRecentOperation(operation => {
      const res = MockPayloadGenerator.generate(
        operation
      ) as GraphQLResponseWithData<Mutable<AppQueryResponse>>
      res.data.ships = []
      return res
    })
    await waitForSuspense()

    const shipList = screen.getByRole('list', {
      name: /Ships/i,
    })
    expect(within(shipList).queryAllByRole('listitem').length).toBe(0)
  })

  test('renders list with 2 ships', async () => {
    environment.mock.resolveMostRecentOperation(operation => {
      const res = MockPayloadGenerator.generate(
        operation
      ) as GraphQLResponseWithData<Mutable<AppQueryResponse>>
      res.data.ships = [
        {
          id: 'one',
          name: 'Ship One',
        },
        {
          id: 'two',
          name: 'Ship Two',
        },
      ]
      return res
    })
    await waitForSuspense()

    const shipList = screen.getByRole('list', {
      name: /Ships/i,
    })
    expect(within(shipList).queryAllByRole('listitem').length).toBe(2)
  })
})
