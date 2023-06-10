class MatrixClientChannel < ApplicationCable::Channel
  def subscribed
    stream_from matrix_client_channel_name
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def matrix_client_channel_name
    user = User.from_serialized(session[:user])
    user.matrix_client_channel_name
  end
end
