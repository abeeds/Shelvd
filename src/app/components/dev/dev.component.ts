import { Component } from '@angular/core';
import { DB, getColumns, initDB } from '../../db/db';



@Component({
    selector: 'dev',
    standalone: true,
    templateUrl: `./dev.component.html`,
    styleUrl: `./dev.component.css`
}) export class DevComponent {
    rows: Map<string, any[]>;

    constructor() {
        this.rows = new Map<string, any[]>
    }

    ngOnInit() {
        DB.each("SELECT name FROM sqlite_master WHERE type='table'", (err: any, table: any) => {
            let all_rows: Map<string, any>[] = [];
            DB.each(`SELECT * FROM ${table.name}`, (err: any, row: any) => {
                all_rows.push(row);
            }, () => {
                this.rows.set(table, all_rows);
            });

            console.log(this.rows);
        });

    }
}