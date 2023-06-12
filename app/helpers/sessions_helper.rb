# frozen_string_literal: true

require 'matrix_sdk'
require Rails.root.join('lib/app_matrix_utils.rb')

# connects makes the actual api requests for the session controller
# tries to hide the data, dont expose the full client
module SessionsHelper
  include AppMatrixUtils

  def get_access_token(home_server, username, password)
    api = MatrixSdk::Api.new home_server

    # status = handle_matrix_request_error do
    api.login(user: username, password:)
    # end
    # TODO: add the status thing to the errors

    api.access_token
  end

  def get_rooms(client)
    rooms = {}

    client.rooms.each do |room|
      rooms.store(room.id, room.display_name)
    end

    rooms
  end
end
