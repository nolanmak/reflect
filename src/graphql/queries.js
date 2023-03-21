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
      createdAt
      updatedAt
    }
  }
`;
export const listFoci = /* GraphQL */ `
  query ListFoci(
    $filter: ModelFocusFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFoci(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        FocusTopics
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
