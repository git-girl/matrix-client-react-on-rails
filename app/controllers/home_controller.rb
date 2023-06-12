# frozen_string_literal: true

# Main app entry
class HomeController < ApplicationController
  include SessionsHelper

  # TODO: lean controller fat models
  def index
    if session[:user]
      user = User.from_serialized(session[:user])
      @home_props = {
        user: {
          username: user.username,
          home_server: user.home_server,
          active_room: [user.current_room_id, user.current_room_name]
        }
      }
    else
      @home_props = {
        user: {
          username: nil,
          home_server: nil
        }
      }
    end
  end
end
