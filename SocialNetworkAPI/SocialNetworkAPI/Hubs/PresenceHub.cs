using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class PresenceHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (userId != null)
        {
            await Clients.All.SendAsync("UserConnected", userId);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (userId != null)
        {
            await Clients.All.SendAsync("UserDisconnected", userId);
        }
    }
}
