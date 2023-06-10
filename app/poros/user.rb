# frozen_string_literal: true

require 'yaml'

# this is a user poro object to just encapsulate data better
# that is stored in the session
class User
  attr_accessor :username, :home_server, :access_token, :cache_key

  def initialize(username, home_server, access_token = nil, cache_key = nil)
    self.username = username
    self.home_server = home_server
    self.access_token = access_token
    self.cache_key = cache_key
  end

  def matrix_client_channel_name
    "matrix_client_channel:#{username}_#{home_server}"
  end

  def serialize
    YAML.dump(self)
  end

  def self.from_serialized(serialized_user)
    Psych.safe_load(serialized_user,
                    permitted_classes: [
                      User,
                      SecureRandom
                    ])
  end
end
