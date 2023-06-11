# frozen_string_literal: true

class MatrixClientChannel < ApplicationCable::Channel
  def subscribed
    stream_from matrix_client_channel_name
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(request)
    # pp request
  end

  private

  def matrix_client_channel_name
    p_user = params[:user]
    user = User.new(p_user['username'], p_user['home_server'])
    user.matrix_client_channel_name
  end
end
