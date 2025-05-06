import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;
  private messageSubject = new Subject<{ user: string; message: string }>();

  message$ = this.messageSubject.asObservable();

  startConnection(user: string, group: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5293/chat-hub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (user, message) => {
      this.messageSubject.next({ user, message });
    });

    this.hubConnection
      .start()
      .then(() => this.hubConnection!.invoke('JoinGroup', group))
      .catch(err => console.error('SignalR Error:', err));
  }

  sendMessage(group: string, user: string, message: string) {
    if (this.hubConnection) {
      this.hubConnection.invoke('SendMessageToGroup', group, user, message);
    }
  }

  stopConnection(group: string) {
    if (this.hubConnection) {
      this.hubConnection.invoke('LeaveGroup', group).finally(() => {
        this.hubConnection?.stop();
      });
    }
  }
}

