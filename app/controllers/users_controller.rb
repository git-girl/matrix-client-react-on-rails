class UsersController < ApplicationController 

  def new
    @user = User.new(user_params) 
  end

  def create
    @user = User.new(user_params)
    # WARNING: i think i have to be careful how to sync this here 
    # and probably need to set up some background worker for getting 
    # the sync
    client = @user.connect_as_matrix_client
    puts "client is logged in: #{client.logged_in?}"
    @user = User.new( @user.attributes.except('password'))

    if client.api.access_token
      session[:access_token] = client.api.access_token
      session[:client]  = client 
      session[:user] = @user

      sync_job = SyncJob.perform_async(
        client.api.access_token,
        @user.home_server
      )
      sleep 15 

      cache_key = session[:processed_data_key]
      client = Rails.cache.read(cache_key)
      pp client.rooms.map { |room| room.display_name }


      # TODO: send back hey started sync and 
      # React disply wheel
      render json: @user, status: :created

    else 
      render json: { 
        error: "Couldn't authentify you at your home_server",
        status: :unprocessable_entity
    }
    end
  end

  def show; end

  def rooms
    api = session[:api]
  end

  private 

  def user_params
      params.require(:user).permit(:username,
                                   :password,
                                   :home_server,
                                   :display_name)
  end
end
