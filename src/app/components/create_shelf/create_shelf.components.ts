import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';


@Component({
    selector: 'create-shelf',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: `./create_shelf.component.html`,
    styleUrl: `./create_shelf.component.css`
}) export class CreateShelfComponent {

    shelf_name = new FormControl('')
    shelf_desc = new FormControl('')
}
