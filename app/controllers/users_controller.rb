class UsersController < ApplicationController
  def new
    puts "triggered new"
    @user = User.new(user_params) 
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # def show
  #   @user
  # end

  def user_params
      params.require(:user).permit(:username,
                                   :password,
                                   :home_server,
                                   :display_name)
  end
end
