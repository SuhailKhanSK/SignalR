using Microsoft.AspNetCore.SignalR.Client;

namespace SignalRClient
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Hello, World!");

            Console.Write("Enter your name: ");
            string user = Console.ReadLine();

            Console.Write("Enter group to join: ");
            string group = Console.ReadLine();

            var connection = new HubConnectionBuilder()
                .WithUrl("http://localhost:5293/chat-hub")
                .WithAutomaticReconnect()
                .Build();

            connection.On<string, string>("ReceiveMessage", (sender, message) =>
            {
                Console.WriteLine($"{sender}: {message}");
            });

            await connection.StartAsync();
            Console.WriteLine("Connected to hub.");

            await connection.InvokeAsync("JoinGroup", group);

            Console.WriteLine("Type your messages below (or type 'exit' to quit):");

            string? input;
            while ((input = Console.ReadLine()) != "exit")
            {
                await connection.InvokeAsync("SendMessageToGroup", group, user, input);
            }

            await connection.InvokeAsync("LeaveGroup", group);
            await connection.StopAsync();
        }
    }
}
