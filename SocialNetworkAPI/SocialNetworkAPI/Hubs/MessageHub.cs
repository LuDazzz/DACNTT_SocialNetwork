using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace SocialNetworkAPI.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendMessage(int senderId, int receiverId, string message)
        {
            // Gửi tin nhắn đến người nhận (chỉ người đó nhận được)
            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", senderId, message);
        }

        public override async Task OnConnectedAsync()
        {
            // Khi người dùng kết nối, gán ID của họ vào nhóm riêng
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Khi người dùng rời khỏi, xóa khỏi nhóm
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
            }
        }
    }
}
