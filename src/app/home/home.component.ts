import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    template: `
        <table>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Image</th>
            </tr>
            <tr *ngFor="let item of myLst">
                <td>{{ item[0] }}</td>
                <td>{{ item[1] }}</td>
                <td>{{ item[2] }}</td>
            </tr>
        </table>
    `,
    styleUrl: './home.component.css'
})
export class HomeComponent {
    myLst = [["test", "movie", "hello"]]
}
