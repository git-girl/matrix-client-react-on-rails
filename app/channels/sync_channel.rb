# frozen_string_literal: true

# Exists to notify Javascript Client that trying to
# make proper requests is ok
class SyncChannel < ApplicationCable::Channel
  def subscribed
    stream_from sync_channel_name
  end

  def unsubscribed; end

  private

  # TODO: maybe make this based on a session cookie or something
  def sync_channel_name
    "sync_channel_#{params[:user]["username"]}_#{params[:user]["home_server"]}"
  end
end
