# frozen_string_literal: true

# Main app entry
class HomeController < ApplicationController
  include SessionsHelper

  def index
    @home_props = if session[:cache_key]
                    {
                      user: {
                        username: session[:username],
                        home_server: session[:home_server]
                      },
                      # TODO: find a better way to store this stuff 
                      # this always triggers a deserialization which 
                      # is expensive
                      rooms: get_room_display_names(
                        Rails.cache.read(session[:cache_key])
                      )
                    }
                  else
                    {
                      user: {
                        username: session[:username],
                        home_server: session[:home_server]
                      }
                    }
                  end
  end
end
