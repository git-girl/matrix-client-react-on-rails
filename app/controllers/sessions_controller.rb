# frozen_string_literal: true

# This is the main API to interact with the matrix_client
# i.e fetching rooms or stuff like this
class SessionsController < ApplicationController
  include SessionsHelper

  def create
    access_token = get_access_token(
      session_params[:home_server],
      session_params[:username],
      session_params[:password]
    )
    session[:password] = nil

    session[:username] = session_params[:username]
    session[:home_server] = session_params[:home_server]
    session[:access_token] = access_token

    @client = MatrixSdk::Client.new(
      session_params[:home_server],
      read_timeout: 600
    )
    client.api.access_token = access_token
    client.sync
  
    # this acts as a confirmation
    render json: { username: session_params[:username],
                   home_server: session_params[:home_server] },
           status: :created
  end

  # get request
  def sync
    if session[:home_server] && session[:access_token]
      sync_channel_name = "sync_channel_#{session[:username]}_#{session[:home_server]}"

      sync_job_jid = SyncJob.perform_async(
        session[:access_token],
        session[:home_server],
        sync_channel_name
      )

      session[:cache_key] = "sync_job:#{sync_job_jid}"

      ActionCable.server.broadcast(sync_channel_name, { message: 'SYNCJOB_STARTED' })

      render json: {}, status: :created
    else
      render json: {
               error: 'couldnt find your access token'
             },
             status: :unprocessable_entity
    end
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
