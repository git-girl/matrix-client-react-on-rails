# frozen_string_literal: true

require 'matrix_sdk'

class User < ApplicationRecord
  attr_accessor :password 

  def get_access_token
    api = MatrixSdk::Api.new 'https://matrix.org'
    return false unless api.protocol? :CS

    
    api.login user: username, password: password.to_s

    api.access_token
  end
end
