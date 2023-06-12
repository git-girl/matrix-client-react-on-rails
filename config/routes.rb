# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get '/home/index', to:
    'home#index'
  get 'sign_up', to:
    'home#sign_up'

  get '/rooms', to:
    'sessions#rooms'

  post '/session', to:
    'sessions#create'

  get '/sync', to:
    'sessions#sync'

  post '/stream_room', to:
    'sessions#stream_room'

  post '/send_message', to:
    'sessions#send_message'

  post '/signout', to:
    'sessions#destroy'

  root 'home#index'
end
