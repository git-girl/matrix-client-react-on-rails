class UsersController < ApplicationController
  def new
    puts "triggered new"
    @user = User.new(user_params) 
  end

  def create
    @user = User.new(user_params)
    access_token = @user.get_access_token

    # i only want to save the access token not 
    # the password otherwise danger danger
    @user = @user.attributes.except("password")

    if access_token
      if @user.save 
          render json: @user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    else 
      render json: { 
        error: "Couldn't authentify you at your home_server"
    }
    end 
  end

  def user_params
      params.require(:user).permit(:username,
                                   :password,
                                   :access_token,
                                   :home_server,
                                   :display_name)
  end
end
