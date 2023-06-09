require 'yaml'
require 'matrix_sdk'
require 'uri'

class UsersController < ApplicationController 

  def new
    @user = User.new(user_params) 
  end

  def create
    @user = User.new(user_params)
    # WARNING: i think i have to be careful how to sync this here 
    # and probably need to set up some background worker for getting 
    # the sync
    client = @user.connect_as_matrix_client
    puts "client is logged in: #{client.logged_in?}"
      @user = User.new( @user.attributes.except('password'))

    if client.api.access_token
      session[:access_token] = client.api.access_token
      session[:client]  = client 
      session[:user] = @user

      sync_job_jib = SyncJob.perform_async(
        client.api.access_token,
        @user.home_server
      )
      puts "sync_job_jib from controller: ", sync_job_jib
      sleep 15

      cache_key = "sync_job:#{sync_job_jib}"

        serialized_client = Rails.cache.read(cache_key)

      # NOTE: reverse order -> this needs to be a method to build up the permitted_classes
      
      matrix_sdk_util_classes = MatrixSdk::Util.constants.select do |c| 
        MatrixSdk::Util.const_get(c).is_a? Class
      end.map do |c|
        "Util::#{c.to_s}"
      end

      matrix_sdk_classes = MatrixSdk.constants.select do |c| 
        MatrixSdk.const_get(c).is_a? Class
      end

      permitted_classes = matrix_sdk_classes.concat(matrix_sdk_util_classes).map do |c| 
        "MatrixSdk::#{c.to_s}".constantize
      end.push(
        Symbol, 
        URI::HTTPS,
        URI::RFC3986_Parser,
        Regexp,
        Time,
        MatrixSdk::Util::TinycacheAdapter::Value # TODO: Clean this up
      )

        pp permitted_classes
        # ISSUE: handling NameError (uninitialized constant MatrixSdk::AccountDataCache)
        # need to import that stuff somehow

        # ISSUE: cant deserialize the redis cache client object
        # pp matrix_sdk_classes
        # cannot load using YAML::load cuz doesnt allow arbitray classes
        client = Psych.safe_load(serialized_client,
                                 permitted_classes: permitted_classes,
                                 aliases: true)

        pp client.rooms.map { |room| room.display_name }


        # TODO: send back hey started sync and 
        # React disply wheel
        render json: @user, status: :created

    else 
      render json: { 
        error: "Couldn't authentify you at your home_server",
        status: :unprocessable_entity
      }
    end
  end

  def show; end

  def rooms
    api = session[:api]
  end

  private 

  def user_params
    params.require(:user).permit(:username,
                                 :password,
                                 :home_server,
                                 :display_name)
  end
end
