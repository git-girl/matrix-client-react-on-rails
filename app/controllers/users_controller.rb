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
    # BUG: client sync causes SystemStackError Stack too Deep
    # client.sync
    # client.rooms.count

    @user = User.new( @user.attributes.except('password'))

    # TODO: this whole user setup is not cute pls fix
    # this needs to be a redis store i think 
    # 1. move it to a session controller 
    # 2. down the line implement a redis cache

    if client.api.access_token
      session[:access_token] = client.api.access_token
      session[:client]  = client 
      session[:user] = @user
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
