import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProtocolDataDisplayModule } from './protocol-data-display/protocol-data-display.module';
import { ProtocolDataLabelControlsModule } from './protocol-data-label-controls/protocol-data-label-controls.module';
import { ProtocolDataPlaybackControlsModule } from './protocol-data-playback-controls/protocol-data-playback-controls.module';
import { MenuModule } from './menu/menu.module';
import { HelloComponent } from './hello/hello.component';

@NgModule({
  declarations: [AppComponent, HelloComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    ProtocolDataPlaybackControlsModule,
    ProtocolDataLabelControlsModule,
    ProtocolDataDisplayModule,
    MenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
