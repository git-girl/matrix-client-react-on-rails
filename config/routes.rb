Rails.application.routes.draw do
  resources :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get '/home/index', to: 
    'home#index'
  get 'sign_up', to: 
    'home#sign_up'

  resource :user do 
    get :rooms
  end
    
  root "home#index"
end
