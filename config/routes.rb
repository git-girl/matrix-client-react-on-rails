# frozen_string_literal: true

Rails.application.routes.draw do
  resources :users
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

  root 'home#index'
end
