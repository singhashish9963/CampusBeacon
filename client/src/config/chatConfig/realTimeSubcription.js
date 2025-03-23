import supabase from "./supabaseClient.js";

/**
 * Subscribes to new messages in a specific channel.
 * @param {number} channelId - The ID of the channel to subscribe to.
 * @param {function} callback - A callback function that is called with the new message data when an INSERT event occurs.
 */
const subscribeToMessages = (channelId, callback) => {
  // The real-time subscription filters Messages table events by the channelId.
  const subscription = supabase
    .from(`Messages:channelId=eq.${channelId}`)
    .on("INSERT", (payload) => {
      callback(payload.new);
    })
    .subscribe();

  return subscription;
};

export { subscribeToMessages };
