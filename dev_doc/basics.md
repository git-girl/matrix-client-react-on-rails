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

Tb(very)h: 
- i still dont quite get the point is it only client side rendering? 
- the modularity was always there with partials

Also another Question: 
- when do i start creating new packs/bundles. 
  Like i do want to group stuff there.
  - Everything that interacts maybe?
