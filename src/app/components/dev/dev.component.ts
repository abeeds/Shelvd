import { Component } from '@angular/core';
import { DB, getColumns, initDB } from '../../db/db';



@Component({
    selector: 'dev',
    standalone: true,
    templateUrl: `./dev.component.html`,
    styleUrl: `./dev.component.css`
}) export class DevComponent {
    table: Map<string, any[][]>;
    // hash map with table names as keys
    // values are list of lists
    // index 0 -> names of collumns
    // each subsequent index is a row on the table

    constructor() {
        this.table = new Map<string, any[][]>
    }

    ngOnInit() {
        let tableNames: string[] = [];
        DB.serialize(() => {
            DB.each("SELECT name FROM sqlite_master WHERE type='table'", (err: any, row: any) => {
                tableNames.push(row.name);
            });
            
            for (let i = 0; i < tableNames.length; i++) {
                getColumns(tableNames[i]).then((res) => {
                    this.table.set(tableNames[i], [res]);
                })
            }
        })
    }
}