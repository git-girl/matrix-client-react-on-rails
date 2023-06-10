# frozen_string_literal: true

require_relative '../poros/user'

# This is the main API to interact with the matrix_client
# i.e fetching rooms or stuff like this
class SessionsController < ApplicationController
  include SessionsHelper

  def create
    client = MatrixSdk::Client.new(
      session_params[:home_server],
      read_timeout: 600
    )
    client.login session_params[:username], session_params[:password]

    user = User.new(session_params[:username],
                    session_params[:home_server],
                    client.api.access_token,
                    nil, # no cache_key yet
                    )
    session[:user] = user.serialize

    # this acts as a confirmation
    render json: {
      username: user.username,
      home_server: user.home_server
    }, status: :created
  end

  # get request
  def sync
    user = User.from_serialized(session[:user])
    pp user

    client = MatrixSdk::Client.new(user.home_server, read_timeout: 600)
    client.api.access_token = user.access_token
    client.sync

    user.cache_key = SecureRandom.uuid
    Rails.cache.write(user.cache_key, YAML.dump(client), expires_in: 24.hours)

    render json: {
      username: user.username,
      home_server: user.home_server
    }, status: :created
  end

  # TODO: this entire session cache_key might be better
  # implemeneted as an ActionCable thing no?
  def rooms
    serialized_client = Rails.cache.read(session[:cache_key])

    unless serialized_client
      render json: {
        error: 'sync not finished',
        status: :unprocessable_entity
      }
    end

    rooms = get_rooms(serialized_client)

    render json: rooms, status: :created
  end

  def stream_room
    # TODO: 1. check for sync

    # 2. get the client
    serialized_client = Rails.cache.read(session[:cache_key])

    room = join_room(serialized_client, session_params[:room_id])
    client.join_room(room)
    room.on_event.add_handler { |event| on_message(room, event) }
    client.start_listener_thread

    render json: {}, status: :created
  end

  private

  def session_params
    params.require(:session).permit(:username,
                                 :password,
                                 :home_server,
                                 :room_id)
  end
end
