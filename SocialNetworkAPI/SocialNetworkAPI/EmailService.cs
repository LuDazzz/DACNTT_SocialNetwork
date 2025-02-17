using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;
namespace SocialNetworkAPI
{
    public class EmailService
    {
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("SocialNetworkThread", "your-email@example.com"));
            email.To.Add(new MailboxAddress("", toEmail));
            email.Subject = subject;

            email.Body = new TextPart("plain")
            {
                Text = body
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("mtan18062003@gmail.com", "vgzk nhcf rirk myjp");
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
