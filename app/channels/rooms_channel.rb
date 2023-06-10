# frozen_string_literal: true

# Is for streaming any updates to rooms
# is a bit pointless as you could just transmit the new
# rooms
class RoomsChannel < ApplicationCable::Channel
  def subscribed
    stream_from room_channel_name
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def room_channel_name
    user = params[:user]
    "rooms_channel:#{user['username']}_#{user['home_server']}"
  end
end
