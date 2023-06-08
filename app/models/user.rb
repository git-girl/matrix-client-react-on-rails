# frozen_string_literal: true

class User < ApplicationRecord
  include ActiveModel::SecurePassword

  attr_accessor :password_digest

  has_secure_password

end
