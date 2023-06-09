class HomeController < ApplicationController

  def index 
    @home_props = { user: session[:user] }
  end

  def sign_up; end
end
