import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import * as styles from "./Channel.scss";

import { ChannelQueryVariables } from "./__generated__/ChannelQuery";
import {
  PostNewMessageMutationResult,
  PostNewMessageMutationResult_postMessage,
  PostNewMessageMutationVariables
} from "./__generated__/PostNewMessageMutation";
import Editor from "../components/Editor";
import { DraftMessage, SubscribeToMoreFn, SubscribeToMoreFnResult } from "../types";

import { ApolloClient } from "apollo-boost";
import ChannelMessageList from "./ChannelMessageList";
import {
  ChannelQuery,
  CHANNEL_QUERY,
  POST_NEW_MESSAGE_MUTATION,
  UPDATE_DRAFT_CLIENT_MUTATION,
  ChannelQueryResult,
  DRAFT_MESSAGE_FOR_CHANNEL_QUERY,
  DraftMessageForChannelQuery,
  ON_NEW_MESSAGE_SUBSCRIPTION
} from "./ChannelQueries";
import { NotFound } from "./NotFound";
import GraphQLErrorViewer from "../components/GraphQLErrorViewer";
import ChannelLoadingIndicator from "./ChannelLoadingIndicator";
import { getLocalUserId } from "../authService";
import { OnNewMessageSubscriptionVariables, OnNewMessageSubscriptionResult } from "./__generated__/OnNewMessageSubscription";

interface ChannelProps extends RouteComponentProps<{ currentChannelId: string }> {}
// interface ChannelState {
//   currentChannelId: string;
//   refetch: boolean;
// }

export default class Channel extends React.Component<ChannelProps> {
  subscribeToNewMessages(subscribeToMore: SubscribeToMoreFn, currentChannelId: string): SubscribeToMoreFnResult {
    return subscribeToMore({
      document: ON_NEW_MESSAGE_SUBSCRIPTION,
      variables: {
        channelId: currentChannelId
      } as OnNewMessageSubscriptionVariables,
      updateQuery: (prev, { subscriptionData }) => {
        const subscriptionResult = subscriptionData.data as OnNewMessageSubscriptionResult;
        const prevQueryChannelResult = prev as ChannelQueryResult;

        if (!subscriptionResult) return prevQueryChannelResult;
        if (!prevQueryChannelResult.channel) return prevQueryChannelResult;

        // we may already have message "fragment" from another query
        // in that case we have to replace the message, otherwise add the message

        let messageFound = false;
        const newMessages = prevQueryChannelResult.channel.messages.map(message => {
          if (message.id === subscriptionResult.messageAdded.id) {
            messageFound = true;
            return {
              ...message,
              ...subscriptionResult.messageAdded
            };
          }

          return message;
        });

        if (!messageFound) {
          newMessages.push(subscriptionResult.messageAdded);
        }

        const newResult: ChannelQueryResult = {
          ...prevQueryChannelResult,
          channel: {
            ...prevQueryChannelResult.channel,
            messages: newMessages
          }
        };

        console.log("CHANNEL UPDATE QUERY newResult", newResult);

        return newResult;
      }
    });
  }

  publishDraftMessage = (client: ApolloClient<any>, currentChannelId: string, newValue: string) => {
    const userId = getLocalUserId();

    client.mutate({
      mutation: UPDATE_DRAFT_CLIENT_MUTATION,
      variables: {
        channelId: currentChannelId,
        authorId: userId,
        text: newValue
      },
      // QUESTION: that is not so nice, as we have to know all other queries that
      //           might depend on this mutation
      refetchQueries: [
        {
          query: DRAFT_MESSAGE_FOR_CHANNEL_QUERY,
          variables: {
            channelId: currentChannelId
          }
        }
      ]
    });
  };

  postNewMessage = async (client: ApolloClient<any>, currentChannelId: string, newValue: string) => {
    const userId = getLocalUserId();
    const mutationResult = await client.mutate<PostNewMessageMutationResult>({
      mutation: POST_NEW_MESSAGE_MUTATION,
      variables: {
        channelId: currentChannelId,
        authorId: userId,
        message: newValue
      } as PostNewMessageMutationVariables,
      update: (proxy, { data }) => {
        const postMessage: PostNewMessageMutationResult_postMessage = data && data.postMessage;
        if (!postMessage) {
          return;
        }
        const existingChannel = proxy.readQuery<ChannelQueryResult>({
          query: CHANNEL_QUERY,
          variables: {
            channelId: currentChannelId
          } as ChannelQueryVariables
        });

        if (!existingChannel || !existingChannel.channel) {
          return;
        }

        if (!existingChannel.channel.messages.find(m => m.id === postMessage.id)) {
          console.log("Message add!");
          existingChannel.channel.messages.push(postMessage);
          proxy.writeQuery({ query: CHANNEL_QUERY, data: existingChannel });
        } else {
          console.log("Message with id " + postMessage.id + " already in channel " + existingChannel.channel.id);
        }
      }
    });
    if (!mutationResult.errors) {
      this.publishDraftMessage(client, currentChannelId, "");
    }
  };

  // static getDerivedStateFromProps(nextProps: ChannelProps, prevState?: ChannelState): Partial<ChannelState> {
  //   const nextChannelId = nextProps.match.params.currentChannelId;

  //   return {
  //     refetch: !prevState || nextChannelId !== prevState.currentChannelId,
  //     currentChannelId: nextChannelId
  //   };
  // }

  render() {
    // const { refetch, currentChannelId } = this.state;
    const {
      match: {
        params: { currentChannelId }
      }
    } = this.props;

    // console.log(`Channel#render() currentChannelId: ${currentChannelId} refetch: ${refetch}`);

    return (
      <div className={styles.Channel}>
        <ChannelQuery query={CHANNEL_QUERY} variables={{ channelId: currentChannelId }} fetchPolicy="cache-and-network">
          {({ loading, error, data, client, subscribeToMore }) => {
            if (loading) {
              return <ChannelLoadingIndicator />;
            }

            if (error) {
              return <GraphQLErrorViewer error={error} />;
            }

            if (!data || !data.channel) {
              return <NotFound />;
            }

            const { channel } = data;
            return (
              <React.Fragment>
                <ChannelMessageList
                  subscribeToNewMessages={() => this.subscribeToNewMessages(subscribeToMore, currentChannelId)}
                  channel={channel}
                />

                <DraftMessageForChannelQuery query={DRAFT_MESSAGE_FOR_CHANNEL_QUERY} variables={{ channelId: currentChannelId }}>
                  {({ data: result }) => {
                    const message = (result && result.draftMessageForChannel && result.draftMessageForChannel.text) || "";
                    return (
                      <Editor
                        label="Enter your message"
                        value={message}
                        onValueChange={currentValue => this.publishDraftMessage(client, currentChannelId, currentValue)}
                        onSubmit={newValue => this.postNewMessage(client, currentChannelId, newValue)}
                      />
                    );
                  }}
                </DraftMessageForChannelQuery>
              </React.Fragment>
            );
          }}
        </ChannelQuery>
      </div>
    );
  }
}
