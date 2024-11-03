import { Component } from '@angular/core';
import { DB, SHELFID, TABLECOUNT, TCTABLENAME } from '../../db/db';
import { SHELF } from '../../db/db';
import { deleteShelf, insertShelf, updateShelf } from '../../db/db-shelf';



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
        new Promise((resolve) => {
            DB.each(`SELECT * FROM ${TABLECOUNT} WHERE ${TCTABLENAME} = ?`, 
                [SHELF],
                (err: any, row: any) => {
                    console.log(row);
                    resolve(row.row_count);
                }
            );
        }).then(async (count) => {
            console.log(count);
            if(count === 0) {
                await insertShelf("movies");
                await insertShelf("action movies");
                await insertShelf("comics");
            }
            await DB.each(`SELECT * FROM ${SHELF}`, (err: any, row:any) => {
                console.log(row);
            });
        });
    }
}