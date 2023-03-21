/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEntry = /* GraphQL */ `
  mutation CreateEntry(
    $input: CreateEntryInput!
    $condition: ModelEntryConditionInput
  ) {
    createEntry(input: $input, condition: $condition) {
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
export const updateEntry = /* GraphQL */ `
  mutation UpdateEntry(
    $input: UpdateEntryInput!
    $condition: ModelEntryConditionInput
  ) {
    updateEntry(input: $input, condition: $condition) {
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
export const deleteEntry = /* GraphQL */ `
  mutation DeleteEntry(
    $input: DeleteEntryInput!
    $condition: ModelEntryConditionInput
  ) {
    deleteEntry(input: $input, condition: $condition) {
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
export const createGoal = /* GraphQL */ `
  mutation CreateGoal(
    $input: CreateGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    createGoal(input: $input, condition: $condition) {
      id
      frequency
      createdAt
      updatedAt
    }
  }
`;
export const updateGoal = /* GraphQL */ `
  mutation UpdateGoal(
    $input: UpdateGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    updateGoal(input: $input, condition: $condition) {
      id
      frequency
      createdAt
      updatedAt
    }
  }
`;
export const deleteGoal = /* GraphQL */ `
  mutation DeleteGoal(
    $input: DeleteGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    deleteGoal(input: $input, condition: $condition) {
      id
      frequency
      createdAt
      updatedAt
    }
  }
`;
export const createFocus = /* GraphQL */ `
  mutation CreateFocus(
    $input: CreateFocusInput!
    $condition: ModelFocusConditionInput
  ) {
    createFocus(input: $input, condition: $condition) {
      id
      FocusTopics
      createdAt
      updatedAt
    }
  }
`;

export const updateFocus = /* GraphQL */ `
  mutation UpdateFocus(
    $input: UpdateFocusInput!
    $condition: ModelFocusConditionInput
  ) {
    updateFocus(input: $input, condition: $condition) {
      id
      FocusTopics
      createdAt
      updatedAt
    }
  }
`;
export const deleteFocus = /* GraphQL */ `
  mutation DeleteFocus(
    $input: DeleteFocusInput!
    $condition: ModelFocusConditionInput
  ) {
    deleteFocus(input: $input, condition: $condition) {
      id
      FocusTopics
      createdAt
      updatedAt
    }
  }
`;
