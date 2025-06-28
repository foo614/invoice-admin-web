# 1. Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything
COPY . .

# Restore and publish the .NET backend
RUN dotnet restore
RUN dotnet publish invoice-admin-web.csproj -c Release -o /out

# Build the frontend (Ant Design Pro)
WORKDIR /app/ClientApp
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# Copy built frontend to wwwroot
RUN mkdir -p /out/wwwroot && cp -r dist/* /out/wwwroot/

# 2. Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /out .

ENTRYPOINT ["dotnet", "invoice-admin-web.dll"]
