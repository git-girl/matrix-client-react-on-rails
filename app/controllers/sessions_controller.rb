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
                    nil) # no cache_key yet
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

    client = MatrixSdk::Client.new(user.home_server, read_timeout: 600)
    client.api.access_token = user.access_token
    client.sync

    user.cache_key = SecureRandom.uuid
    Rails.cache.write(user.cache_key, YAML.dump(client), expires_in: 24.hours)

    session[:user] = user.serialize

    render json: {
      username: user.username,
      home_server: user.home_server
    }, status: :created
  end

  # TODO: this entire session cache_key might be better
  # implemeneted as an ActionCable thing no?
  def rooms
    user = User.from_serialized(session[:user])
    serialized_client = Rails.cache.read(user.cache_key)

    unless serialized_client
      render json: {
        error: 'sync not finished',
        status: :unprocessable_entity
      }
    end

    # TODO: also get something like current room from the room
    # you last sent a message
    rooms = get_rooms(serialized_client)

    render json: rooms, status: :created
  end

  # TODO: This should just get triggered at sync
  def stream_room
    user = User.from_serialized(session[:user])
    mcj_id = MatrixClientJob.perform_async(user.serialize,
                                           user.matrix_client_channel_name,
                                           session_params[:room_id])

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
