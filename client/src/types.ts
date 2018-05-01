import { SubscribeToMoreOptions } from "apollo-boost";

export interface DraftMessage {
  id: string;
  text: string;
}

export type SubscribeToMoreFn = (options: SubscribeToMoreOptions) => () => void;
export type SubscribeToMoreFnResult = () => void;
