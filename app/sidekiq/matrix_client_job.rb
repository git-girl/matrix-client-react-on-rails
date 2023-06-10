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
