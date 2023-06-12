# frozen_string_literal: true

require 'matrix_sdk'
require Rails.root.join('lib/app_matrix_utils.rb')
require 'json'

# Sets the client to listen and transmits all data via the client channel
class MatrixListenerJob
  include Sidekiq::Job
  include AppMatrixUtils

  def perform(serialized_user, matrix_client_channel_name, room_id)
    puts "PERFORMING"
    return if cancelled?

    user = User.from_serialized(serialized_user)
    client = sync_and_init_matrix_client(user)
    # there Is no room listener thread here yet on the client
    room = client.find_room(room_id)
    ActionCable.server.broadcast(matrix_client_channel_name,
                                 { events: room.events })

    room.on_event.add_handler do |event|
      ActionCable.server.broadcast(
        matrix_client_channel_name,
        { event: JSON.dump(event) }
      )
    end

    # WARN: this streams for every room now on the same channel
    loop do
      return if cancelled?

      client.sync
    rescue StandardError => e
      ActionCable.server.broadcast(matrix_client_channel_name,
                                  { message: "failed to sync got: \n#{e}. Waiting 5 seconds to retry." })
      sleep 5
    end
  end

  def self.cancel!(jid)
    # Set redis cahce key cancelled-JID to 1 with an expiration time out 24 hours
    Rails.cache.write("cancelled-#{jid}", 1, expires_in: 24.hours)
  end

  def cancelled?
    Rails.cache.fetch("cancelled-#{self.jid}") == 1
  end

  def sync_and_init_matrix_client(user)
    client = MatrixSdk::Client.new(user.home_server, read_timeout: 600)
    client.api.access_token = user.access_token
    client.sync

    client
  end
end
