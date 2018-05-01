import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import * as styles from "./Channel.scss";

import { Col, Row } from "../layout";

import { ChannelQueryVariables } from "./__generated__/ChannelQuery";
import {
  PostNewMessageMutationResult,
  PostNewMessageMutationResult_postMessage,
  PostNewMessageMutationVariables
} from "./__generated__/PostNewMessageMutation";
import MessageEditor from "./MessageEditor";
import { DraftMessage, SubscribeToMoreFn } from "../types";

import { ApolloClient } from "apollo-boost";
import MessageList from "./MessageList";
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
import ChannelError from "./ChannelError";
import ChannelLoadingIndicator from "./ChannelLoadingIndicator";
import { getLocalUserId } from "../authService";
import { OnNewMessageSubscriptionVariables, OnNewMessageSubscriptionResult } from "./__generated__/OnNewMessageSubscription";

interface ChannelProps extends RouteComponentProps<{ currentChannelId: string }> {}
// interface ChannelState {
//   currentChannelId: string;
//   refetch: boolean;
// }

export default class Channel extends React.Component<ChannelProps> {
  subscribeToNewMessages(subscribeToMore: SubscribeToMoreFn, currentChannelId: string) {
    subscribeToMore({
      document: ON_NEW_MESSAGE_SUBSCRIPTION,
      variables: {
        channelId: currentChannelId
      } as OnNewMessageSubscriptionVariables,
      updateQuery: (prev, { subscriptionData }) => {
        const subscriptionResult = subscriptionData.data as OnNewMessageSubscriptionResult;
        const prevQueryChannelResult = prev as ChannelQueryResult;

        console.log("CHANNEL UPDATE QUERY cId:", currentChannelId);
        console.log("CHANNEL UPDATE QUERY prev:", prev);
        console.log("CHANNEL UPDATE QUERY data", subscriptionData.data);

        if (!subscriptionResult) return prevQueryChannelResult;
        if (!prevQueryChannelResult.channel) return prevQueryChannelResult;

        const newMessages = prevQueryChannelResult.channel.messages.concat(subscriptionResult.messageAdded);

        const newChannel = {
          ...prevQueryChannelResult.channel,
          messages: newMessages
        };

        const newResult: ChannelQueryResult = {
          ...prevQueryChannelResult,
          channel: newChannel
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

        console.log("exstingChannel.channel");
        console.dir(existingChannel.channel);

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
    const { match: { params: { currentChannelId } } } = this.props;

    // console.log(`Channel#render() currentChannelId: ${currentChannelId} refetch: ${refetch}`);

    return (
      <div className={styles.Channel}>
        <ChannelQuery query={CHANNEL_QUERY} variables={{ channelId: currentChannelId }} fetchPolicy="cache-and-network">
          {({ loading, error, data, client, subscribeToMore }) => {
            if (loading) {
              return <ChannelLoadingIndicator />;
            }

            if (error) {
              return <ChannelError error={error} />;
            }

            if (!data || !data.channel) {
              return <NotFound />;
            }

            const { channel } = data;
            return (
              <div className={styles.XXX}>
                <MessageList
                  subscribeToNewMessages={() => this.subscribeToNewMessages(subscribeToMore, currentChannelId)}
                  channel={channel}
                />
                <Row className={styles.Editor}>
                  <Col className={styles.Form}>
                    <DraftMessageForChannelQuery
                      query={DRAFT_MESSAGE_FOR_CHANNEL_QUERY}
                      variables={{ channelId: currentChannelId }}
                    >
                      {({ data: result }) => {
                        const message = (result && result.draftMessageForChannel && result.draftMessageForChannel.text) || "";
                        return (
                          <MessageEditor
                            message={message}
                            onMessageChange={currentValue => this.publishDraftMessage(client, currentChannelId, currentValue)}
                            onNewMessage={newValue => this.postNewMessage(client, currentChannelId, newValue)}
                          />
                        );
                      }}
                    </DraftMessageForChannelQuery>
                  </Col>
                </Row>
              </div>
            );
          }}
        </ChannelQuery>
      </div>
    );
  }
}
