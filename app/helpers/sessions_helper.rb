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
    api.login(user: username, password: password)
    # end
    # TODO: add the status thing to the errors

    api.access_token
    # client = MatrixSdk::Client.new(home_server, read_timeout: 600)
    # client.api.access_token = access_token
    #
    # client
  end

  def get_room_display_names(serialized_client)
    client = deserialze_client(serialized_client)

    # BUG: if there was a sync then
    # this fails because serlialized client
    # has been read out of cache?
    client.rooms.map(&:display_name)
  end
end
