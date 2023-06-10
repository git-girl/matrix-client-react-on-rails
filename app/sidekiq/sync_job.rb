# frozen_string_literal: true

require 'matrix_sdk'
require 'yaml'
require 'action_cable/server'

# Performs SyncJob, needs to be sync otherwise Stack blows up
class SyncJob
  include Sidekiq::Job

  # NOTE: "Your perform method arguments must be simple,
  # basic types like String, integer, boolean that are
  # supported by JSON. Complex Ruby objects will not work."
  def perform(access_token, home_server)
    client = MatrixSdk::Client.new(home_server, read_timeout: 600)
    client.api.access_token = access_token
    client.sync

    cache_key = "sync_job:#{jid}"

    Rails.cache.write(cache_key, YAML.dump(client), expires_in: 24.hours)

    ActionCable.server.broadcast('sync_channel', { message: 'SYNCJOB_COMPLETE' })
  end
end
