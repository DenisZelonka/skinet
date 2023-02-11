using API.Extensions;
using API.Helpers;
using API.Middleware;
using Core.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddDbContext<StoreContext>(x => 
    x.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(MappingProfiles));

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddCors(opt=>
{
    opt.AddPolicy("CorsPolicy",policy=>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");;
    });
});

var app = builder.Build();

using (var scope=app.Services.CreateScope())
{
    var services= scope.ServiceProvider;
    var loggerFactory= services.GetRequiredService<ILoggerFactory>();
    try
    {
        var context= services.GetRequiredService<StoreContext>();
        var identityContext= services.GetRequiredService<AppIdentityDbContext>();
        var userManager= services.GetRequiredService<UserManager<AppUser>>();
        await context.Database.MigrateAsync();
        await identityContext.Database.MigrateAsync();
        await StoreContextSeed.SeedAsync(context,loggerFactory);
        await AppIdentityDbContextSeed.SeedUserAsync(userManager);
    }
    catch (System.Exception ex)
    {
        var logger= loggerFactory.CreateLogger<Program>();
        logger.LogError(ex,"An error occured during migration");
        
    }
}

// Configure the HTTP request pipeline.

app.UseMiddleware<ExceptionMiddleware>();

app.UseSwaggerDocumention();

app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseHttpsRedirection();

app.UseRouting();

app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
