# frozen_string_literal: true

# Main app entry
class HomeController < ApplicationController
  def index
    @home_props = {
      user: {
        username: session[:username],
        home_server: session[:home_server]
      },
    }
  end
end
