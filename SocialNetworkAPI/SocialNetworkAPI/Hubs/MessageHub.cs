using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SocialNetworkAPI.Hubs
{
    public class MessageHub : Hub
    {
        // Called when a client connects to the hub
        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext()?.Request.Query["userId"];
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnConnectedAsync();
        }

        public async Task SendMessage(int senderId, int receiverId, string content, string imageUrl)
        {
            await Clients.User(receiverId.ToString())
                .SendAsync("ReceiveMessage", new
                {
                    SenderID = senderId,
                    Content = content,
                    ImageUrl = imageUrl,
                    Timestamp = DateTime.Now
                });
        }

        // Called when a client disconnects from the hub
        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            var userId = Context.GetHttpContext()?.Request.Query["userId"];
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        // Method to send notifications
        public async Task SendNotification(int receiverId, string notification)
        {
            await Clients.User(receiverId.ToString()).SendAsync("ReceiveNotification", notification);
        }
    }
}
