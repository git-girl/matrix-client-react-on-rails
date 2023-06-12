# frozen_string_literal: true

require 'yaml'

# this is a user poro object to just encapsulate data better
# that is stored in the session
# NOTE: this should be a thing of User poro and a room Poro where user has a room poro
class User
  attr_accessor :username, :home_server, :access_token, :cache_key, :matrix_job_id, :current_room_id, :current_room_name

  def initialize(username,
                 home_server,
                 access_token = nil,
                 cache_key = nil,
                 matrix_job_id = nil,
                 current_room_id = nil,
                 current_room_name = nil)

    self.username = username
    self.home_server = home_server
    self.access_token = access_token
    self.cache_key = cache_key
    self.matrix_job_id = matrix_job_id
    self.current_room_id = current_room_id
    self.current_room_name = current_room_name
  end

  def update_room_and_job(room_id, matrix_job_id, current_room_name = nil)
    cancel_current_matrix_job

    self.current_room_id = room_id
    self.current_room_name = current_room_name
    self.matrix_job_id = matrix_job_id
    self
  end

  def cancel_current_matrix_job
    MatrixListenerJob.cancel!(matrix_job_id) if matrix_job_id
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
