require 'matrix_sdk'

class SyncJob
  include Sidekiq::Job

  # TODO: set Up Prod Redis

  # NOTE: Your perform method arguments must be simple,
  # basic types like String, integer, boolean that are 
  # supported by JSON. Complex Ruby objects will not work.
  def perform(access_token, home_server)
    client = MatrixSdk::Client.new(home_server, read_timeout: 600)
    client.api.access_token = access_token
    client.sync

    # ISSUE: cannot write client (unserializable) to cache

    cache_key = SecureRandom.hex(16)
    Rails.cache.write(cache_key, client, expires_in: 24.hours) 

    session[:synced_client_key] = cache_key
    puts "cache at cache_key: ", Rails.cache.read(cache_key)
  end
end
