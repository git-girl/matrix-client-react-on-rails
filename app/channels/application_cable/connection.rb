# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :session_user

    def connect
      self.session_user = matrix_authed_user
    end

    private

    # ISSUE: this is dangerous i think.
    # if a malicous actor modifies their session username and home_server
    # succesfully they can access others streams. that would invalidate
    # their session though. this is not very secure.
    def matrix_authed_user
      # WARNING: Hack
      session = request.env['rack.session']

      if session[:username] && session[:home_server]
        { username: session[:username], home_server: session[:home_server] }
      else
        reject_unauthorized_connection
      end
    end
  end
end
