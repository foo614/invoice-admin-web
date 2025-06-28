# 1. Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY . .

# ✅ Use the correct csproj filename (all lowercase with dashes)
RUN dotnet restore invoice-admin-web.csproj
RUN dotnet publish invoice-admin-web.csproj -c Release -o /out

# 2. Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# ✅ Also update DLL name to match output
ENTRYPOINT ["dotnet", "invoice-admin-web.dll"]
