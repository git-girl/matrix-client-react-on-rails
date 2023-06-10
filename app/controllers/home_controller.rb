# frozen_string_literal: true

# Main app entry
class HomeController < ApplicationController
  include SessionsHelper

  # TODO: lean controller fat models
  def index
    @home_props = if session[:cache_key]
                    {
                      user: {
                        username: session[:username],
                        home_server: session[:home_server]
                      },
                      rooms: get_rooms(
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
