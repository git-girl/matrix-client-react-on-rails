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

    # I think this has become obsolete
    user.cache_key = SecureRandom.uuid
    Rails.cache.write(user.cache_key, YAML.dump(client), expires_in: 24.hours)

    session[:user] = user.serialize

    render json: {
      username: user.username,
      home_server: user.home_server
    }, status: :created
  end

  def rooms
    user = User.from_serialized(session[:user])
    client = MatrixSdk::Client.new(user.home_server, read_timeout: 600)
    client.api.access_token = user.access_token
    client.reload_rooms!

    rooms = get_rooms(client)

    render json: rooms, status: :created
  end

  # TODO: This should just get triggered at sync
  def stream_room
    user = User.from_serialized(session[:user])
    mcj_id = MatrixListenerJob.perform_async(user.serialize,
                                             user.matrix_client_channel_name,
                                             session_params[:room_id])

    user = user.update_room_and_job(session_params[:room_id], mcj_id)
    session[:user] = user.serialize
    render json: { room_id: user.current_room_id }, status: :created
  end

  def send_message
    user = User.from_serialized(session[:user])

    client = MatrixSdk::Client.new(user.home_server, read_timeout: 600)
    client.api.access_token = user.access_token
    client.sync

    room = client.find_room(user.current_room_id)

    room.send_text session_params[:message].to_s

    render json: { room_id: user.current_room_id }, status: :created
  end

  # TODO: this should be in a rooms controller
  def create_room
    user = User.from_serialized(session[:user])

    client = MatrixSdk::Client.new(user.home_server, read_timeout: 600)
    client.api.access_token = user.access_token
    client.sync

    begin
      # NOTE: Passing params doesnt work need to create public then set private
      room = client.create_room(session_params[:new_room])
      room.invite_only = true

      user.current_room_id = room.room_id

      session[:user] = user.serialize
      render json: { room_id: user.current_room_id }, status: :created
    rescue StandardError => e
      render json: { error: e.to_s }, status: :unprocessable_entity
    end
  end

  def destroy
    user = User.from_serialized(session[:user])
    user.cancel_current_matrix_job

    # TODO: Clear all Cached things

    session[:user] = nil
    redirect_to root_url, notice: 'Logged out!'
  end

  private

  def session_params
    params.require(:session).permit(:username,
                                    :password,
                                    :home_server,
                                    :room_id,
                                    :new_room,
                                    :message)
  end
end
