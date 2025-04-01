import supabase from "./supabaseClient.js";

/**
 * Subscribes to messages in a specific channel with support for all event types.
 * @param {number} channelId - The ID of the channel to subscribe to.
 * @param {Object} callbacks - Object containing callback functions for different events.
 * @param {function} callbacks.onInsert - Called when a new message is inserted.
 * @param {function} callbacks.onUpdate - Called when a message is updated.
 * @param {function} callbacks.onDelete - Called when a message is deleted.
 * @returns {Object} Subscription object that can be used to unsubscribe.
 */
const subscribeToMessages = (channelId, callbacks = {}) => {
  const { onInsert, onUpdate, onDelete } = callbacks;
  
  // Create a more reliable channel name
  const channelName = `messages-channel-${channelId}-${Date.now()}`;
  
  console.log(`Setting up real-time subscription for channel ${channelId} with name ${channelName}`);
  
  const subscription = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "Messages",
        filter: `channelId=eq.${channelId}`,
      },
      (payload) => {
        console.log("Real-time INSERT event received:", payload.new);
        if (onInsert) onInsert(payload.new);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "Messages",
        filter: `channelId=eq.${channelId}`,
      },
      (payload) => {
        console.log("Real-time UPDATE event received:", payload.new);
        if (onUpdate) onUpdate(payload.new, payload.old);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*", // Listen to all events for DELETE to ensure it's captured
        schema: "public",
        table: "Messages",
      },
      (payload) => {
        // Only process DELETE events here
        if (payload.eventType === "DELETE") {
          console.log("Real-time DELETE event received:", payload);
          
          // Check if the deleted message belongs to this channel
          // Note: For DELETE events, we might not have channelId in payload.old
          // so we'll handle all DELETE events and let the component filter them
          if (onDelete) onDelete(payload.old);
        }
      }
    )
    .subscribe((status) => {
      console.log(`Subscription status for channel ${channelId}:`, status);
    });

  return subscription;
};

/**
 * Subscribes to user status and profile changes.
 * @param {Object} callbacks - Object containing callback functions for different events.
 * @param {function} callbacks.onInsert - Called when a new user is inserted.
 * @param {function} callbacks.onUpdate - Called when a user is updated.
 * @param {function} callbacks.onDelete - Called when a user is deleted.
 * @returns {Object} Subscription object that can be used to unsubscribe.
 */
const subscribeToUsers = (callbacks = {}) => {
  const { onInsert, onUpdate, onDelete } = callbacks;
  
  const subscription = supabase
    .channel("users-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "users",
      },
      (payload) => {
        if (onInsert) onInsert(payload.new);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
      },
      (payload) => {
        if (onUpdate) onUpdate(payload.new, payload.old);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "users",
      },
      (payload) => {
        if (onDelete) onDelete(payload.old);
      }
    )
    .subscribe();

  return subscription;
};

/**
 * Subscribes to channel updates.
 * @param {Object} callbacks - Object containing callback functions for different events.
 * @returns {Object} Subscription object that can be used to unsubscribe.
 */
const subscribeToChannels = (callbacks = {}) => {
  const { onInsert, onUpdate, onDelete } = callbacks;
  
  const subscription = supabase
    .channel("channels")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "Channels",
      },
      (payload) => {
        if (onInsert) onInsert(payload.new);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "Channels",
      },
      (payload) => {
        if (onUpdate) onUpdate(payload.new, payload.old);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "Channels",
      },
      (payload) => {
        if (onDelete) onDelete(payload.old);
      }
    )
    .subscribe();

  return subscription;
};

export { subscribeToMessages, subscribeToUsers, subscribeToChannels };
