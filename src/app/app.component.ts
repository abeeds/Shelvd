import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { initDB, closeDB } from './db/db';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HomeComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'shelvd';

    async ngOnInit() {
        const db = initDB();
    }
}
