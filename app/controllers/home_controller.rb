# frozen_string_literal: true

# Main app entry
class HomeController < ApplicationController
  # TODO: this needs to properlty return the user session
  # object
  # and in the Home Component i need to use props.user then
  # again
  def index
    if session[:username] && session[:home_server]
      @home_props = {
        user: {
          username: session[:username],
          home_server: session[:home_server]
        }
      }
    else
      @home_props = {
        user: nil
      }
    end
  end

  def sign_up; end
end
