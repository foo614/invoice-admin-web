# 1. Build stage for .NET + Frontend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything
COPY . .

# Restore & publish .NET backend
RUN dotnet restore Invoice.Admin.Web.csproj
RUN dotnet publish Invoice.Admin.Web.csproj -c Release -o /out

# Install Node.js + build Ant Design Pro frontend
WORKDIR /app/ClientApp
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# Copy frontend output into wwwroot
RUN mkdir -p /out/wwwroot/web-portal && cp -r dist/* /out/wwwroot/web-portal/

# 2. Final runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /out .

ENTRYPOINT ["dotnet", "Invoice.Admin.Web.dll"]
