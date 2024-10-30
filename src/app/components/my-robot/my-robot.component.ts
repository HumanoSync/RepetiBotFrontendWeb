import { Component } from '@angular/core';
import { FooterComponent } from '../pages/footer/footer.component';
import { HeaderComponent } from '../pages/header/header.component';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-my-robot',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,  // Agrega el Header
    FooterComponent,   // Agrega el Footer
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './my-robot.component.html',
  styleUrl: './my-robot.component.scss'
})
export class MyRobotComponent {

}
