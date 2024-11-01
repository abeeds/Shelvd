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

    async ngOnInit() {
        DB.all('SELECT name FROM sqlite_master WHERE type="table"', (err: any, rows: any) => {
            (rows as { name: string }[]).forEach(row => {
                console.log(row.name);
            });
        });
    }
}