# frozen_string_literal: true

require 'yaml'
require 'matrix_sdk'
require 'uri'

# Defines Utility methods to simplify
# MatrixSdk Usage
module AppMatrixUtils
  # include MatrixSdk

  # the permitted classes for deserialization
  PERMITTED_CLASSES = [
    MatrixSdk::Client,
    MatrixSdk::Api,
    MatrixSdk::MXID,
    MatrixSdk::Room,
    MatrixSdk::User,
    MatrixSdk::MatrixError,
    MatrixSdk::MatrixRequestError,
    MatrixSdk::MatrixNotAuthorizedError,
    MatrixSdk::MatrixForbiddenError,
    MatrixSdk::MatrixNotFoundError,
    MatrixSdk::MatrixConflictError,
    MatrixSdk::MatrixTooManyRequestsError,
    MatrixSdk::MatrixConnectionError,
    MatrixSdk::MatrixTimeoutError,
    MatrixSdk::MatrixUnexpectedResponseError,
    MatrixSdk::Util::AccountDataCache,
    MatrixSdk::Util::StateEventCache,
    MatrixSdk::Util::TinycacheAdapter,
    Symbol,
    Proc,
    URI::HTTPS,
    URI::RFC3986_Parser,
    Regexp,
    Time,
    MatrixSdk::Util::TinycacheAdapter::Value,
    MatrixSdk::EventHandlerArray
  ]

  # pp PERMITTED_CLASSES

  # Applies to instances of:
  # MatrixConflictError,
  # MatrixForbiddenError,
  # MatrixNotAuthorizedError,
  # MatrixNotFoundError,
  # MatrixTooManyRequestsError
  #
  # TODO:write a decent error Interface
  def handle_matrix_request_error(e)
    [
      e.code,
      e.data,
      e.httpstatus,
      e.message
    ]
  end

  # TODO: write a decent error Interface
  def handle_matrix_error
    yield
  rescue MatrixSdk::MatrixRequestError,
         MatrixConflictError,
         MatrixForbiddenError,
         MatrixNotAuthorizedError,
         MatrixNotFoundError,
         MatrixTooManyRequestsError => e
    handle_matrix_request_error(e)
  end

  def deserialze_client(serialized_client)
    Psych.safe_load(serialized_client,
                    permitted_classes: PERMITTED_CLASSES,
                    aliases: true)
  end

  def deserialze_matrix_thing(serialized_matrix_thing)
    Psych.safe_load(serialized_matrix_thing,
                    permitted_classes: PERMITTED_CLASSES,
                    aliases: true)
  end
end
