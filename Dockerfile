# 1. Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY . .

# Explicitly publish the main project to /out
RUN dotnet publish Invoice.Admin.Web.csproj -c Release -o /out

# Build frontend (Ant Design Pro)
WORKDIR /app/ClientApp
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# Copy built frontend to the wwwroot folder of the backend
RUN mkdir -p /out/wwwroot && cp -r dist/* /out/wwwroot/

# 2. Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Run the backend
ENTRYPOINT ["dotnet", "Invoice.Admin.Web.dll"]
