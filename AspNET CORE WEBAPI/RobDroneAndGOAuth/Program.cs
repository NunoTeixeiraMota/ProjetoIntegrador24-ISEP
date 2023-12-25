using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using RobDroneAndGOAuth.Model.User;
using System.Drawing.Text;
using AspNetCore.Identity.MongoDbCore;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using Microsoft.AspNetCore.Identity;
using RobDroneAndGOAuth.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using RobDroneAndGOAuth.Services.IServices;
using RobDroneAndGOAuth.Model.ApplicationRole;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel (the web server) to listen on all interfaces
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // Set up the HTTP and HTTPS endpoints
    serverOptions.ListenAnyIP(5054); // Listen for HTTP on port 5054 on all network interfaces
});
// Add services to the container.
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Add services to the container.

var mongoDbConfig = builder.Configuration.GetSection("MongoDbConfig");
var connectionString = mongoDbConfig["ConnectionString"];
var databaseName = mongoDbConfig["Database"];
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevOrigin",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});


builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+ ";
})
.AddMongoDbStores<ApplicationUser, ApplicationRole, ObjectId>
(
    connectionString,
    databaseName
)
.AddDefaultTokenProviders();


var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]);
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddScoped<IUserAppService, UserAppService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// UseCors must be called before UseAuthentication and UseAuthorization
app.UseCors("AllowAngularDevOrigin");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();


