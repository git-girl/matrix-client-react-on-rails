# frozen_string_literal: true

require 'matrix_sdk'
require Rails.root.join('lib/app_matrix_utils.rb')
require 'json'

# Sets the client to listen and transmits all data via the client channel
# For Sending Data there is obviously another job ( cant read ActionCable broadcast here)
class MatrixClientJob
  include Sidekiq::Job
  include AppMatrixUtils

  def perform(serialized_user, matrix_client_channel_name, inital_room_id)
    # Init
    user = User.from_serialized(serialized_user)
    client = sync_and_init_matrix_client(user)
    # there Is no room listener thread here yet on the client

    # TODO: make this a sperate worker or something because then you cant
    # get the message history except for the Initial Room
    # room = client.find_room(inital_room_id)
    # ActionCable.server.broadcast(matrix_client_channel_name, { events: room.events })

    # TODO: set the room event listener as the main thing
    room = client.find_room(inital_room_id)

    members = room.members
    keys = members.map { |member| client.get_user(member).device_keys }

    client.on_event.add_handler do |event|
      ActionCable.server.broadcast(
        matrix_client_channel_name,
        { event: JSON.dump(event), keys: JSON.dump(keys) }
      )
    rescue StandardError => e
      puts e
    end

    # WARN: this streams for every room now on the same channel
    loop do
      client.sync
    rescue StandardError => e
      AcionCable.server.broadcast(matrix_client_channel_name,
                                  { message: "failed to sync got: \n#{e}. Waiting 5 seconds to retry." })
      sleep 5
    end
  end

  # TODO: the event here is too complex because the message
  # event is much larger then the message event i originally
  # had when getting room.events

  def sync_and_init_matrix_client(user)
    client = MatrixSdk::Client.new(user.home_server, read_timeout: 600)
    client.api.access_token = user.access_token
    client.sync

    client
  end
end
