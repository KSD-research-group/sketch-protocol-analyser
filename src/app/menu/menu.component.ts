import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ProjectConfService } from '../project-conf/project-conf.service';
import { SessionReference } from '../project-conf/session-reference.interface';
import { CreateSessionComponent } from './create-session/create-session.component';
import { SelectSessionComponent } from './select-session/select-session.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  @ViewChild('menuTrigger') menuTrigger?: MatMenuTrigger;
  configs?: SessionReference[];

  constructor(
    private configSvc: ProjectConfService,
    private dialog: MatDialog
  ) {
    this.configSvc.configschange.subscribe(
      (configs) => (this.configs = configs)
    );
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateSessionComponent, {
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger?.focus());
  }

  openSelectDialog() {
    const dialogRef = this.dialog.open(SelectSessionComponent, {
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger?.focus());
  }
}
