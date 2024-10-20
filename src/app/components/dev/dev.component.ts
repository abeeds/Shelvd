import { Component } from '@angular/core';
import { DB, getColumns, initDB } from '../../db/db';



@Component({
    selector: 'dev',
    standalone: true,
    templateUrl: `./dev.component.html`,
    styleUrl: `./dev.component.css`
}) export class DevComponent {
    colls: Map<string, string[]>;
    rows: Map<string, any[][]>;
    // hash map with table names as keys
    // each index in the list is a row on the table

    constructor() {
        this.rows = new Map<string, any[][]>
        this.colls = new Map<string, string[]>
    }

    ngOnInit() {
        DB.serialize(() => {
            DB.each("SELECT name FROM sqlite_master WHERE type='table'", (err: any, table: any) => {
                getColumns(table.name).then((res) => {
                    this.colls.set(table.name, res);
                    console.log(this.colls);
                });

                // fetch data in this table
            });
            
        })
    }
}