import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SignalRService } from '../signalR.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.less'
})
export class ChatComponent implements OnDestroy {
  user = '';
  group = '';
  message = '';
  messages: { user: string; message: string }[] = [];

  private sub: Subscription | undefined;

  constructor(private signalRService: SignalRService) {}

  connect() {
    this.signalRService.startConnection(this.user, this.group);
    this.sub = this.signalRService.message$.subscribe(msg => this.messages.push(msg));
  }

  send() {
    this.signalRService.sendMessage(this.group, this.user, this.message);
    this.message = '';
  }

  disconnect() {
    this.signalRService.stopConnection(this.group);
    this.sub?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
