# frozen_string_literal: true

require 'matrix_sdk'

# Sets the client to listen and transmits all data via the client channel
# WARNING: Cant use Sidqkiq here because
class MatrixClientJob
  include Sidekiq::Job

  def perform(serialized_user, matrix_client_channel_name)
    user = User.from_serialized(serialized_user)

    client = MatrixSdk::Client.new(user.home_server, read_timeout: 600)
    client.api.access_token = user.access_token
    client.sync

    room = client.find_room('!YcdlKUHdHYxJJYBIkM:matrix.org')
    ActionCable.server.broadcast(matrix_client_channel_name, { message: 'STARTED_MATRIXCLIENT' })
    ActionCable.server.broadcast(matrix_client_channel_name, { events: room.events })
  end

  def broadcast_event(matrix_client_channel_name, event)
    ActionCable.server.broadcast(matrix_client_channel_name, { message: event })
  end
end

# class MyWorker
#   include Sidekiq::Worker
#
#   def perform
#     # Connect to the ActionCable channel
#     channel = ActionCable.server.broadcasting_adapter.new(ServerChannel)
#
#     # Subscribe to the desired channel
#     subscription = channel.subscribe do |data|
#       # Process the received data and perform actions based on it
#       process_data(data)
#     end
#
#     # Keep the worker alive to continuously listen for new data
#     loop do
#       sleep 1
#     end
#   ensure
#     # Unsubscribe from the channel when the worker stops
#     channel.unsubscribe(subscription) if channel && subscription
#   end
#
#   def process_data(data)
#     # Implement your logic here to process the received data
#     # and perform the necessary actions
#   end
# end
