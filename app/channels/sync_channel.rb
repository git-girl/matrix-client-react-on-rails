# frozen_string_literal: true

# Exists to notify Javascript Client that trying to
# make proper requests is ok
class SyncChannel < ApplicationCable::Channel
  def subscribed
    # TODO: use params session cookie or access token or something
    # to make the channels unique
    stream_from 'sync_channel'
  end

  def unsubscribed; end
end
