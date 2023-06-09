require 'matrix_sdk'
require 'yaml'

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

    cache_key = "sync_job:#{jid}"

    # NOTE: Rather then using the YAML dump i might be able to user the Tuny Cache 
      # but there are multiple Matrix caches. 
      # i think it would maybe be easier to deserialize those, but also more 
      # work handling multiple cache entries 
    Rails.cache.write(cache_key, YAML::dump(client), expires_in: 24.hours) 

    puts "cache_key: #{cache_key}"
    
  end
end
