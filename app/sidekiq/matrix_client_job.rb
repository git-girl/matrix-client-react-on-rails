# frozen_string_literal: true

require 'matrix_sdk'

# Sets the client to listen and transmits all data via the client channel
class MatrixClientJob
  include Sidekiq::Job

  # NOTE: FOR NOW JUST GIVE A CLIENT AND LISTEN AND TRANSMIT FOR ONE ROOM
  def perform(client)
    client.start_listener_thread

    # give the client rooms event listeners
  end
end
