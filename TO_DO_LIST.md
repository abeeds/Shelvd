- DB
    - create a table that keeps track of count and last used id for fast lookups, 
        - write trigger that keeps count of rows on a table
            - +1 on insert into a table
            - -1 on delete into a table
        - write trigger to auto generate an id for a row
            - last_id + 1 on insert into a table
            - update column that column
        - write trigger to add row into table
            - create table adds a row
            - drop table removes it
    - need to automate it for whenever a new table is created
        - createTable should also create the trigger
    - fail safes
        - check if a table exists before trying to create it in createTable
- Front end
    - pages to design:
        - shelves
            - main displays
                - grid view
                - list view
            - create shelf (form)
            - update shelf (form)
        - items
            - insert item
            - update item
        - settings
            - export database option
            - grid dimensions
