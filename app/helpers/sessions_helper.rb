# frozen_string_literal: true

require 'matrix_sdk'
require Rails.root.join('lib/app_matrix_utils.rb')

# connects makes the actual api requests for the session controller
# tries to hide the data, dont expose the full client
module SessionsHelper
  include AppMatrixUtils

  def get_access_token(home_server, username, password)
    api = MatrixSdk::Api.new home_server

    # status = handle_matrix_request_error do
    api.login(user: username, password:)
    # end
    # TODO: add the status thing to the errors

    api.access_token
  end

  def get_rooms(serialized_client)
    rooms = {}
    client = deserialze_client(serialized_client)

    client.rooms.each do |room|
      rooms.store(room.id, room.display_name)
    end

    rooms
  end

  def join_room(serialized_client, room_id)
    client = deserialze_client(serialized_client)

    return { error: 'room not found' } unless client.ensure_room(room_id)

    client.rooms.select { |room| room.id == room_id }.first

    # MatrixSdk thing
    client.join_room()
  end

  def on_message(room, event)
    case event.type
    when 'm.room.member'
      puts "[#{Time.now.strftime '%H:%M'}] #{event[:content][:displayname]} joined." if event.membership == 'join'
    when 'm.room.message'
      user = get_user event.sender
      admin_level = get_user_level(room, user.id) || 0
      prefix = ' '
      prefix = '+' if admin_level >= 50
      prefix = '@' if admin_level >= 100
      if %w[m.text m.notice].include? event.content[:msgtype]
        notice = event.content[:msgtype] == 'm.notice'
        puts "[#{Time.now.strftime '%H:%M'}] <#{prefix}#{user.display_name}> #{"\033[1;30m" if notice}#{event.content[:body]}#{"\033[0m" if notice}"
      elsif event[:content][:msgtype] == 'm.emote'
        puts "[#{Time.now.strftime '%H:%M'}] *#{prefix}#{user.display_name} #{event.content[:body]}"
      else
        puts "[#{Time.now.strftime '%H:%M'}] <#{prefix}#{user.display_name}> (#{event.content[:msgtype]}) #{event.content[:body]} - #{api.get_download_url event.content[:url]}"
      end
    end
  end
end
