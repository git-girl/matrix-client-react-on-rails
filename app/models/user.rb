# frozen_string_literal: true

require 'matrix_sdk'

class User < ApplicationRecord
  attr_accessor :password 

  # WARNING: dont try to pretty_print stuff the json is too deep
  # will blow up
  def connect_as_matrix_client
    # NOTE: doing this api get token first because otherwise 
    # SDK blows up
    api = MatrixSdk::Api.new home_server

    begin 
      api.login user: username, password: password
    rescue MatrixSdk::MatrixRequestError => e 
      pp [
        e.code,
        e.data, 
        e.httpstatus,
        e.message
      ]
    end 
    access_token = api.access_token

    client = MatrixSdk::Client.new(home_server, read_timeout: 600)
    client.api.access_token = access_token

    return client
  end

  # API is not what i want i want a MatrixSdk::Client
  def rooms
    api = MatrixSdk::Api.new home_server 

    pp [api, res]
  end
end
