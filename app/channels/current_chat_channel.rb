# frozen_string_literal: true

# :^)
class CurrentChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from current_chat_channel_name
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def current_chat_channel_name
    "current_chat_channel_#{params[:user]["username"]}_#{params[:user]["home_server"]}"
  end
end
