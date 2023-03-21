/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEntry = /* GraphQL */ `
  query GetEntry($id: ID!) {
    getEntry(id: $id) {
      id
      content
      title
      topic
      bookmarked
      createdAt
      updatedAt
    }
  }
`;
export const listEntries = /* GraphQL */ `
  query ListEntries(
    $filter: ModelEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEntries(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        title
        topic
        bookmarked
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGoal = /* GraphQL */ `
  query GetGoal($id: ID!) {
    getGoal(id: $id) {
      id
      frequency
      createdAt
      updatedAt
    }
  }
`;
export const listGoals = /* GraphQL */ `
  query ListGoals(
    $filter: ModelGoalFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGoals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        frequency
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFocus = /* GraphQL */ `
  query GetFocus($id: ID!) {
    getFocus(id: $id) {
      id
      FocusTopics
      sortKey
      createdAt
      updatedAt
    }
  }
`;
export const listFoci = /* GraphQL */ `
  query ListFoci(
    $id: ID
    $filter: ModelFocusFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listFoci(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        FocusTopics
        sortKey
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
