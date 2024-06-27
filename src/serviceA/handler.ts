import { EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';

// see Minimum information needed for a valid custom event
// https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html#eb-custom-event
type EventDetailType = string;
type EventBridgeEventDetail = { message: string };
type EventBridgeHandlerResult = boolean;

export const handler: EventBridgeHandler<
  EventDetailType,
  EventBridgeEventDetail,
  EventBridgeHandlerResult
> = async (
  event: EventBridgeEvent<EventDetailType, EventBridgeEventDetail>,
) => {
  console.log(`received event: ${JSON.stringify(event)}`);
  return true;
};
