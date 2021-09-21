import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SelectSessionComponent } from './select-session/select-session.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { CreateSessionComponent } from './create-session/create-session.component';
import { MatInputModule } from '@angular/material/input';
import { FileSelectorComponent } from './create-session/file-selector/file-selector.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    MenuComponent,
    SelectSessionComponent,
    CreateSessionComponent,
    FileSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatInputModule,
    MatSnackBarModule
  ],
  exports: [MenuComponent],
})
export class MenuModule {}
