# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY ClientApp/package*.json ./ClientApp/
RUN cd ClientApp && npm install
COPY ClientApp ./ClientApp
RUN cd ClientApp && npm run build

# Stage 2: Build the .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY invoice-admin-web.sln .
COPY invoice-admin-web.csproj ./
COPY . ./
RUN dotnet restore invoice-admin-web.csproj
RUN dotnet publish invoice-admin-web.csproj -c Release -o /app/publish

# Stage 3: Copy frontend into backend's wwwroot and run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy backend build output
COPY --from=build /app/publish .

# Copy built React frontend into wwwroot
COPY --from=frontend-build /app/ClientApp/dist ./wwwroot

ENTRYPOINT ["dotnet", "invoice-admin-web.dll"]

