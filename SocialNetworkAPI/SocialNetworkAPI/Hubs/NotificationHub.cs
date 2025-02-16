using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SocialNetworkAPI.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendNotification(int userId, string message)
        {
            await Clients.User(userId.ToString()).SendAsync("ReceiveNotification", message);
        }
    }
}
