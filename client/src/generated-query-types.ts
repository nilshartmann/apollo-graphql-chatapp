/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface usersQuery {
  users:  Array< {
    id: string,
    // The readable name
    name: string,
  } >,
  channels:  Array< {
    id: string,
    title: string,
    latestMessage:  {
      id: string,
      date: string,
      author:  {
        id: string,
      },
      text: string,
    },
  } >,
};
