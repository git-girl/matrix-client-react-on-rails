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

    session[:home_server] = session_params[:home_server]
    session[:access_token] = access_token

    # this acts as a confirmation
    render json: { username: session_params[:username],
                   home_server: session_params[:home_server] },
           status: :created
  end

  # get request
  def sync
    if session[:home_server] && session[:access_token]

      sync_job_jib = SyncJob.perform_async(
        session[:access_token],
        session[:home_server]
      )
      session[:cache_key] = "sync_job:#{sync_job_jib}"

      render json: {},
             status: :created
    else
      render json: {
               error: 'couldnt find your access token'
             },
             status: :unprocessable_entity
    end
  end

  def rooms
    serialized_client = Rails.cache.read(session[:cache_key])

    unless serialized_client
      render json: {
        error: 'sync not finished',
        status: :unprocessable_entity
      }
    end

    rooms = get_room_display_names(serialized_client)

    render json: { rooms: rooms }, status: :created
  end

  private

  def session_params
    params.require(:session).permit(:username,
                                    :password,
                                    :home_server)
  end
end
