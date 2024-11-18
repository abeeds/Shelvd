# Shelvd

## File Structure
### Database - /src/app/db
All functions and methods modifying the SQLite database can be found here.
All functions from files dedicated to specific tables return this
kind of array: [boolean, message]. The boolean indicates whether the function 
was capable of doing its task. The message is there to indicate why it may have
failed.

#### db.ts
This file contains some basic methods for accessing and initializing tha database.
It also contains most of the constants used across the other database files.
For example, you will be able to find table and column names as strings exported here.

The following functions are available in this file:
- numTables() - returns a promise containing the number of tables available
- getColumns(table_name: string) - returns a promise of an array of column names for the specified table
- tableExists(table_name: string) - returns a promise of a boolean indicating if the specified table exists
- initTables() - this function initializes all the base tables used in this project
- initDB() - establishes a connection to the database, also initializes the DB if it has not been created yet

#### db-shelf.ts
This file contains methods for modifying the shelf table.

The following functions are available in this file:
- insertShelf(shelf_name: string, shelf_desc: string='')
- updateShelf(shelf_id: number, new_name: string='', new_desc: string='')
- deleteShelf(shelf_id: number)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
