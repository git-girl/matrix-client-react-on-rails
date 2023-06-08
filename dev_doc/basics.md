# Basics 

react_component("Name", props: @props, prerender: false)
- the prerender decides if true then server renders to html
  otherwise client side rendering
- check it out with noscript you do get more html sent with 
  prerender true, pretty cool stuff this client side rendering 
  - html brutalism cries, poor non modern device

Same old: 
- The workflow is defining data in the backend, 
- pass them using instance vars or partial locals 
React diff: 
- in the html.erb you react components 
  - these and their stuff like aditional css or js defined under 
    `app/javascripts/bundles/NAME/components` 
  - you need to register these components in the bundles and server bundles 
    ( the error msg is pretty clear that you need to check that though :)  ) 
  - are there generators for react components? No :(
  - the folder strucutre should be 
    ```
    - javascript 
      - bundles  
        - Bundlename 
          - components 
            - ComponentName 
              - Component 
              - Componenent Server 
              - Componenent CSS
    ```

## What to bundle 
"it depends"

- Identifying entry points (each thing directly rendered through a rails view) 
- Shared Dependencies 
- always watch out that bundle sizes don't grow to large. 

## Links 
- just do an `<a>` element its good to put the links in a constants 
  definition file though in the bundle

## Forms 
- build out the form with JSX
  - define some onSubmit event

- need to match the rails API 
  ``` js
  import request from 'axios'
  request.post('user', {user}, requestConfig);
  ```
- 
